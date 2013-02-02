declare var $: IJQuery.JQueryStatic;

module IJQuery {

  interface JQueryStatic {
    url(): JQueryUrl;
  }

  interface JQueryUrl {
    param(): any;
    attr(name: string): string;
  }

}