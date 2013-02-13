
export function toggle(currentOption: any, options: any[]) {
  var o = this;
  for (var i = 0; i < options.length; i++) {
    if (o.params.areEqual(currentOption, options[i])) {
      return options[(i + 1) % options.length];
    }
  }
}