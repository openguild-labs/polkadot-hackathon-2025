using CiFarm.Scripts.Services.NakamaServices;
using System;
using System.Reflection;

namespace CiFarm.Scripts.Utilities
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
        public static string GetStringValue<TEnum>(this TEnum enumValue) where TEnum : Enum
        {
            var field = enumValue.GetType().GetField(enumValue.ToString());
            var attribute = field.GetCustomAttribute<EnumStringValueAttribute>();
            return attribute != null ? attribute.StringValue : enumValue.ToString();
        }
    }
}