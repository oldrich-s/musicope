declare class Pouch {
 
  constructor (urlName: string, callback: (error: ph.PouchError, db: ph.DB) => void);
  constructor (urlName: string, options: any, callback: (error: ph.PouchError, db: ph.DB) => void);

  static destroy(name: string, callback?: (error: ph.PouchError, info) => void);
  
  static replicate(from: string, to: string);
  static replicate(from: string, to: string, options: ph.ReplicateOptions);
  static replicate(from: string, to: string, callback: (error: ph.PouchError, changes) => void);
  static replicate(from: string, to: string, options: ph.ReplicateOptions, callback: (error: ph.PouchError, changes) => void);
}

declare function Pouch(name: string, callback: (error: ph.PouchError, db: ph.DB) => void): Pouch;
declare function Pouch(name: string, options: any, callback: (error: ph.PouchError, db: ph.DB) => void): Pouch;

module ph {

  interface DB {

    // should be avoided
    //post(doc: any, options, callback?: (error: PouchError, response: Response) => void);

    put(doc: { _id: string; });
    put(doc: { _id: string; }, options: PutOptions);
    put(doc: { _id: string; }, callback: (error: PouchError, response: Response) => void);
    put(doc: { _id: string; }, options: PutOptions, callback: (error: PouchError, response: Response) => void);

    putAttachment(id: string, rev: string, doc, type, callback?: (error: PouchError, response: Response) => void );
    bulkDocs(docs: { docs: any[]; }, callback: (error: PouchError, response: Response) => void);
    bulkDocs(docs: { docs: any[]; }, options?, callback?: (error: PouchError, response: Response) => void);

    get(docid: string, callback: (error: PouchError, data: any, xhr: IJQuery.JQueryXHR) => void): void;
    get(docid: string, options: GetOptions, callback: (error: PouchError, data: any, xhr: IJQuery.JQueryXHR) => void): void;

    allDocs(callback: (error: PouchError, response: AllDocsResponse) => void);
    allDocs(options: AllDocsOptions, callback: (error: PouchError, response: AllDocsResponse) => void);
    query(fun: string, options? , callback?);
    query(fun: Query, options? , callback?);
    remove(doc: string, options? , callback?: (error: PouchError, response: Response) => void );
    info(callback);
    changes(options);
    replicate: Replicate;
  }

  interface Replicate {
    from(url, options, callback);
    to;
  }

  interface ReplicateOptions {
    continuous;
    onChange;
    filter;

  }

  interface Query {
    map?(doc: any): void;
    reduce?(doc: any): void;
  }

  interface Doc {
    doc?: any;
    id: string;
    key: string;
    value: { rev: string; };
  }

  interface AllDocsResponse {
    total_rows: number;
    rows: Doc[];
  }

  interface AllDocsOptions {
    startkey?: string;
    endkey?: string;
    descending?: bool;
    include_docs?: bool;
    conflicts?: bool;
  }

  interface PutOptions {
    new_edits: bool;
  }

  interface QueryOptions {
    reduce: bool;
  }

  interface GetOptions {
    revs?: bool;
    revs_info?: bool;
    attachments?: bool;
    rev?: string;
    conflicts?: string;
  }

  interface Response {
    ok: bool;
    id: string;
    rev: string;
  }

  interface PouchError {
    status: number;
    error: string;
    reason: string;
  }

}