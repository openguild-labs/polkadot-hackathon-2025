import { TextProps } from "antd/es/typography/Text";
import { Typography } from "antd";

const { Text } = Typography;

export default function HiddenCopyableText(props: TextProps & {textToCopy?: string} & {iconProps?: TextProps}) {
    const { textToCopy, iconProps, children, ...textProps } = props;
    return (
        <Text
            {...textProps}
            copyable={{
                icon: [
                    <Text key='0' {...iconProps}>{children}</Text>,
                    <Text key='0' {...iconProps}>{children}</Text>
                ],
                text: textToCopy ?? children?.toString() ?? ''
            }}
        />
    );
}
