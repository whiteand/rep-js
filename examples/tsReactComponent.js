const RC = _.template(
  `
import React from 'react'
import s from './<%= name %>.module.scss'

interface I<%= name %>Props {
    // TODO: Add props
}

export default function <%= name %>(props: I<%= name %>Props): JSX.Element {
    return <div className={s.wrapper}>Hello</div>
}
`.trim()
);

writeline(RC({ name: "SelectionInput" }));