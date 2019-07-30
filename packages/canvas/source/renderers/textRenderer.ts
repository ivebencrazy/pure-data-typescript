import { Renderer } from "@pure-data/core"
import { Text } from "@pure-data/elements"
import * as draw from "../drawHelpers"


export default function renderText(renderer: Renderer, el: Text) {
  const { context } = renderer
  const displayText = el.text.replace(/\\/g, "")

  context.strokeStyle = el.color
  draw.text(renderer, el.xPos, el.yPos, displayText)
}
