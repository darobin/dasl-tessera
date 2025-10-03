
import { open, SeekMode } from '@tauri-apps/plugin-fs';
import { create as createCID, CODEC_DCBOR, toCidLink, toString as stringifyCID, CODEC_RAW, HASH_SHA256 } from '@atcute/cid';
import { decode as decodeVarint } from '@atcute/varint';
import { decode as decodeDRISL } from '@atcute/cbor';

// NOTE
// This was lifted straight from @dasl/tiles as well as from @atcute code, but
// Tauri's file system APIs are their own thing so for now at least this makes
// sense.

// FOR DEBUGGING (rick.tile):
// - header
//    varint  2
//    meta    288
// - block 1
//    varint  2
//    cid     36
//    data    678
// - block 2
//    varint  3
//    cid     36
//    data    76137

// XXX IMPORTANT
// Note that resolvePath() returns a stream and doesn't verify.
// Maybe we should use the fact that open() reads the bytes anyway to verify the content.
export default class CarTileReader {
  #path;
  #fh;
  #pos;
  #cid;
  #meta = {};
  #cidOffsets = {};
  constructor (path) {
    this.#path = path;
  }
  get meta () { return this.#meta; }
  get cid () { return this.#cid; }
  async open () {
    this.#fh = await open(this.#path, { read: true });
    this.#pos = 0;
    // read the headers, compute the header CID, and decode to meta
    const headerLength = await this.readVarint();
    if (headerLength === false) throw new RangeError('Unexpected end of data at beginning of CAR');
    const headerBytes = new Uint8Array(headerLength);
    const actuallyRead = await this.#fh.read(headerBytes);
    if (actuallyRead < headerLength) throw new RangeError(`Unexpected end of data reading header`);
    this.#pos += actuallyRead;
    this.#cid = await createCID(CODEC_DCBOR, headerBytes);
    const meta = decodeDRISL(headerBytes);
    delete meta.version;
    delete meta.roots;
    Object.keys(meta.resources).forEach(k => {
      meta.resources[k].src = toCidLink(meta.resources[k].src).toJSON();
    });
    this.#meta = meta;
    let blockSize = await this.readVarint();
    while (blockSize !== false) {
      const cidBytes = new Uint8Array(36);
      const actuallyRead = await this.#fh.read(cidBytes);
      if (actuallyRead < 36) throw new RangeError(`Unexpected end of data reading CID`);
      this.#pos += 36;
      const version = cidBytes[0];
      const codec = cidBytes[1];
      const digestType = cidBytes[2];
      const digestSize = cidBytes[3];
      const digest = cidBytes.subarray(4);
      if (version !== 1) throw new Error(`Wrong CID version: ${version}`);
      if (codec !== CODEC_DCBOR && codec !== CODEC_RAW) throw new Error(`Wrong CID codec: ${codec}`);
      if (digestType !== HASH_SHA256) throw new Error(`Wrong CID digest type: ${digestType}`);
      if (digestSize !== 32) throw new Error(`Wrong CID digest size: ${digestSize}`);
      const cid = stringifyCID({
        version,
        codec,
        digest: { codec: digestType, contents: digest },
        bytes: cidBytes,
      });
      const size = blockSize - 36;
      this.#cidOffsets[cid] = { start: this.#pos, size };
      await this.#fh.seek(size, SeekMode.Current);
      this.#pos += size;
      blockSize = await this.readVarint();
    }
    console.warn(`done indexing tile`, this.#meta, this.#cid, this.#cidOffsets);
  }
  close () {
    this.#fh?.close();
  }
  // We read 8 bytes and parse them to get the int and how many bytes were used,
  // then we seek back to return to the position at the end of the varint.
  async readVarint () {
    if (!this.#fh) throw new Error(`CAR Tile reader not ready.`);
    const buf = new Uint8Array(8);
    const actuallyRead = await this.#fh.read(buf);
    console.warn(`actuallyRead=${actuallyRead}`);
    if (!actuallyRead) return false;
    const [int, readForVarint] = decodeVarint(buf);
    await this.#fh.seek(readForVarint - actuallyRead, SeekMode.Current);
    this.#pos += readForVarint;
    return int;
  }
  // Use this when paths are mapped into the tile.
  resolvePath (path) {
    // XXX this isn't correct because we need to make it work with whatever way we
    // have to communicate with the Worker.
    path = (new URL(`fake:${path}`)).pathname; // remove QS, etc.
    if (!this.#meta.resources?.[path]) return { ok: false, status: 404, statusText: 'Not found' };
    const headers = { ... this.#meta.resources[path] };
    const cid = headers.src.$link;
    delete headers.src;
    return {
      ok: true,
      status: 200,
      statusText: 'Ok',
      headers,
      createReadStream: () => this.#fh.createReadStream({ start: this.#cidOffsets[cid][0], end: this.#cidOffsets[cid][1], autoClose: false }),
    };
  }
}
