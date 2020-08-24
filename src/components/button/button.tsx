import React from "react"
import { IButtonProps } from "../../react-app-env"


export const Button: React.FC<IButtonProps> = (props) => {
    return <a className={(props.className || "") + " button" } onClick={props.onClick}>{props.children}</a>
}