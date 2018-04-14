import { backspace } from "./keys/backspace"
import { c } from "./keys/c"
import { down } from "./keys/down"
import { end } from "./keys/end"
import { esc } from "./keys/esc"
import { h } from "./keys/h"
import { home } from "./keys/home"
import { l } from "./keys/l"
import { left } from "./keys/left"
import { m } from "./keys/m"
import { p } from "./keys/p"
import { right } from "./keys/right"
import { space } from "./keys/space"
import { up } from "./keys/up"
import { w } from "./keys/w"

import { IKeyboardAction } from './i-actions'

export const actions: { [key: string]: IKeyboardAction } = {}

backspace(actions)
c(actions)
down(actions)
end(actions)
esc(actions)
h(actions)
home(actions)
l(actions)
left(actions)
m(actions)
p(actions)
right(actions)
space(actions)
up(actions)
w(actions)