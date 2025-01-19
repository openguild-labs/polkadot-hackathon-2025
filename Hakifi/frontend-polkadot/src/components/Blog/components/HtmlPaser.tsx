import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Image from 'next/image'
import Parse, {
	HTMLReactParserOptions,
	DOMNode,
	Element,
} from 'html-react-parser'

const isElement = (domNode: DOMNode): domNode is Element => {
	const isTag = domNode.type === 'tag'
	const hasAttributes = (domNode as Element).attribs !== undefined

	return isTag && hasAttributes
}

export default function parseRichText(html: string) {
	const parserOptions: HTMLReactParserOptions = {
		replace: (domNode) => {
			if (isElement(domNode) && domNode.name === 'img') {
				return (
					<Image
						src={domNode.attribs.src}
						alt={domNode.attribs.alt}
						width={+domNode.attribs.width}
						height={+domNode.attribs.height}
						priority // either loading="eager" or this prop is required for this to work
						// loading="eager" // lazy does not work
					/>
				)
			}

			return domNode
		},
	}

	const Component = Parse(html, parserOptions) as React.ReactElement
    
	return Component
}