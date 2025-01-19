using System;
using System.Reflection;

namespace CiFarm.Utils
{
    [AttributeUsage(AttributeTargets.Field, Inherited = false, AllowMultiple = false)]
    sealed class EnumStringValueAttribute : Attribute
    {
        public string StringValue { get; }

        public EnumStringValueAttribute(string stringValue)
        {
            StringValue = stringValue;
        }
    }

    public static class EnumExtensions
    {
        public static string GetStringValue<TEnum>(this TEnum enumValue)
            where TEnum : Enum
        {
            var field = enumValue.GetType().GetField(enumValue.ToString());
            var attribute = field.GetCustomAttribute<EnumStringValueAttribute>();
            return attribute != null ? attribute.StringValue : enumValue.ToString();
        }

        public static string GetStringValue(this object enumValue)
        {
            var field = enumValue.GetType().GetField(enumValue.ToString());
            var attribute = field.GetCustomAttribute<EnumStringValueAttribute>();
            return attribute != null ? attribute.StringValue : enumValue.ToString();
        }

        public static TEnum GetEnumValue<TEnum>(this string stringValue)
            where TEnum : Enum
        {
            foreach (var field in typeof(TEnum).GetFields())
            {
                var attribute = field.GetCustomAttribute<EnumStringValueAttribute>();
                if (attribute != null && attribute.StringValue == stringValue)
                {
                    return (TEnum)field.GetValue(null);
                }
            }

            return default;
        }

        public static object GetEnumValue(this Type enumType, string stringValue)
        {
            foreach (var field in enumType.GetFields())
            {
                var attribute = field.GetCustomAttribute<EnumStringValueAttribute>();
                if (attribute != null && attribute.StringValue == stringValue)
                {
                    return field.GetValue(null);
                }
            }

            return null;
        }
    }
}
