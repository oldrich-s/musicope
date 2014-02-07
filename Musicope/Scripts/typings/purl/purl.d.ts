declare var $: JQueryStatic;


interface JQueryStatic {
  url(): JQueryUrl;
}

interface JQueryUrl {
  param(): any;
  attr(name: string): string;
}