using System;

namespace CiFarm.Utils
{
    public static class NullableExtensions
    {
        public static bool IsNullableEnum(this Type t)
        {
            Type u = Nullable.GetUnderlyingType(t);
            return u != null && u.IsEnum;
        }
    }
}
