import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
		return (
			<html>
				<head>
					<link
						rel="stylesheet"
						href="https://code.cdn.mozilla.net/fonts/fira.css"
					/>
				</head>
				<body>
					{children}
				</body>
			</html>
		)
	}

