import { GamePlatform } from "@/interfaces/game";
import { IconProps } from "./IconProps";
import { THEME } from "@/styles/theme";

export default function GamePlatformIcon({ platform }: { platform: GamePlatform }) {
    const color = THEME.TEXT_COLOR;
    switch (platform) {
        case GamePlatform.Web:
            return <WebIcon color={color} />
        case GamePlatform.Desktop:
            return <DesktopIcon color={color} />
        case GamePlatform.Android:
            return <AndroidIcon color={color} />
        case GamePlatform.iOS:
            return <IosIcon color={color} />
    }
}

function AndroidIcon({
    size, color, className
}: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            xmlSpace="preserve"
            width={size ?? 20}
            height={size ?? 20}
            className={className}
            fill={color}
        >
            <path d="M17.523,15.342c-0.552,0-1-0.447-1-0.999s0.447-1,0.999-1c0.552,0,1,0.447,1,0.999  C18.522,14.894,18.075,15.341,17.523,15.342 M6.477,15.342c-0.552,0-1-0.447-1-0.999c0-0.552,0.447-1,0.999-1  c0.552,0,1,0.447,1,0.999C7.476,14.894,7.029,15.341,6.477,15.342 M17.881,9.322l1.997-3.459c0.115-0.199,0.047-0.453-0.152-0.568  c-0.199-0.115-0.453-0.047-0.568,0.152l0,0l-2.022,3.503C15.59,8.244,13.853,7.851,12,7.851S8.41,8.244,6.863,8.949L4.841,5.447  C4.726,5.248,4.472,5.18,4.273,5.294C4.075,5.409,4.006,5.663,4.121,5.862l0,0l1.997,3.46c-3.43,1.865-5.775,5.337-6.119,9.44h24  C23.656,14.659,21.311,11.187,17.881,9.322" />
        </svg>
    )
}

function IosIcon({
    size, color, className
}: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            xmlSpace="preserve"
            width={size ?? 17}
            height={size ?? 17}
            className={className}
            fill={color}
        >

            <g id="_Group_2">
                <g id="_Group_3">
                    <path
                        id="_Path_"
                        d="M18.546,12.763c0.024-1.87,1.004-3.597,2.597-4.576c-1.009-1.442-2.64-2.323-4.399-2.378    c-1.851-0.194-3.645,1.107-4.588,1.107c-0.961,0-2.413-1.088-3.977-1.056C6.122,5.927,4.25,7.068,3.249,8.867    c-2.131,3.69-0.542,9.114,1.5,12.097c1.022,1.461,2.215,3.092,3.778,3.035c1.529-0.063,2.1-0.975,3.945-0.975    c1.828,0,2.364,0.975,3.958,0.938c1.64-0.027,2.674-1.467,3.66-2.942c0.734-1.041,1.299-2.191,1.673-3.408    C19.815,16.788,18.548,14.879,18.546,12.763z"
                    />
                    <path
                        id="_Path_2"
                        d="M15.535,3.847C16.429,2.773,16.87,1.393,16.763,0c-1.366,0.144-2.629,0.797-3.535,1.829    c-0.895,1.019-1.349,2.351-1.261,3.705C13.352,5.548,14.667,4.926,15.535,3.847z"
                    />
                </g>
            </g>
        </svg>
    )
}

function DesktopIcon({
    size, color, className
}: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            xmlSpace="preserve"
            width={size ?? 20}
            height={size ?? 20}
            className={className}
            fill={color}
        >

            <path
                d="M4 6.27238L10.5381 5.38191L10.5417 11.689L4.00622 11.7263L4 6.27238ZM10.5354 12.4159L10.5408 18.7283L4.00533 17.8298V12.3733L10.5354 12.4159ZM11.3281 5.2655L19.9973 4V11.609L11.3281 11.6774V5.2655ZM20 12.4754L19.9973 20.0498L11.3281 18.8251L11.3157 12.4612L20 12.4754Z"
                fill="white"
            />
            {/* <style
                id="PHTStyle"
                dangerouslySetInnerHTML={{
                    __html:
                        '.qtip-content { font-family: "Times New Roman"; font-size: 17px; line-height: 19px; white-space: pre-wrap; } .qtip-max-width { max-width: 700px; }'
                }}
            /> */}
        </svg>
    )
}

function WebIcon({
    size, color, className
}: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            xmlSpace="preserve"
            width={size ?? 20}
            height={size ?? 20}
            className={className}
            fill={color}
        >
            <path xmlns="http://www.w3.org/2000/svg" d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9.71002 19.6674C8.74743 17.6259 8.15732 15.3742 8.02731 13H4.06189C4.458 16.1765 6.71639 18.7747 9.71002 19.6674ZM10.0307 13C10.1811 15.4388 10.8778 17.7297 12 19.752C13.1222 17.7297 13.8189 15.4388 13.9693 13H10.0307ZM19.9381 13H15.9727C15.8427 15.3742 15.2526 17.6259 14.29 19.6674C17.2836 18.7747 19.542 16.1765 19.9381 13ZM4.06189 11H8.02731C8.15732 8.62577 8.74743 6.37407 9.71002 4.33256C6.71639 5.22533 4.458 7.8235 4.06189 11ZM10.0307 11H13.9693C13.8189 8.56122 13.1222 6.27025 12 4.24799C10.8778 6.27025 10.1811 8.56122 10.0307 11ZM14.29 4.33256C15.2526 6.37407 15.8427 8.62577 15.9727 11H19.9381C19.542 7.8235 17.2836 5.22533 14.29 4.33256Z" fill="white"/>
        </svg>
    )
}
