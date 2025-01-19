using System;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CiFarm.Utils
{
    public class DefaultJsonConverter<T> : JsonConverter<T>
        where T : class, new()
    {
        public override void WriteJson(JsonWriter writer, T value, JsonSerializer serializer)
        {
            if (value == null)
            {
                writer.WriteNull();
                return;
            }

            // Start writing the object
            writer.WriteStartObject();

            // Get the properties of the object
            var properties = typeof(T).GetProperties();

            foreach (var property in properties)
            {
                var propertyValue = property.GetValue(value);
                var jsonProperty = property.GetCustomAttribute<JsonPropertyAttribute>();

                // Get the property name from JsonProperty attribute if it exists, otherwise use the property name
                var propertyName = jsonProperty?.PropertyName ?? property.Name;
                writer.WritePropertyName(propertyName);

                if (propertyValue == null)
                {
                    writer.WriteNull();
                    continue;
                }
                // Check if the property is an object (not primitive or enum)
                else if (property.PropertyType.IsClass && property.PropertyType != typeof(string))
                {
                    // Recursively serialize the nested object
                    serializer.Serialize(writer, propertyValue);
                }
                else if (property.PropertyType.IsEnum || property.PropertyType.IsNullableEnum())
                {
                    // If it's an enum, serialize its string representation (e.g., "Approved" instead of 1)
                    writer.WriteValue(propertyValue.GetStringValue());
                }
                else if (property.PropertyType == typeof(Guid))
                {
                    writer.WriteValue(Guid.Parse(propertyValue.ToString()));
                }
                else
                {
                    // Otherwise, serialize the property normally
                    serializer.Serialize(writer, propertyValue);
                }
            }

            // End the object
            writer.WriteEndObject();
        }

        public override T ReadJson(
            JsonReader reader,
            Type objectType,
            T existingValue,
            bool hasExistingValue,
            JsonSerializer serializer
        )
        {
            // Create an instance of the target object
            var target = Activator.CreateInstance<T>();

            // Load the JSON into a JObject for easy property access by name
            var jObject = JObject.Load(reader);

            // Get the properties of the target object
            var properties = typeof(T).GetProperties();

            foreach (var property in properties)
            {
                var jsonProperty = property.GetCustomAttribute<JsonPropertyAttribute>();
                var propertyName = jsonProperty?.PropertyName ?? property.Name;

                // If the property exists in the JSON, set the value
                if (jObject[propertyName] != null)
                {
                    var value = jObject[propertyName];
                    // Check if the property is an enum type
                    if (property.PropertyType.IsEnum)
                    {
                        // If it's an enum, deserialize its value using the custom EnumExtension method
                        var enumValue = EnumExtensions.GetEnumValue(
                            property.PropertyType,
                            value.ToString()
                        );
                        property.SetValue(target, enumValue);
                    }
                    // If the property is an object (class) and not a string, recurse and deserialize it
                    else if (
                        property.PropertyType.IsClass
                        && property.PropertyType != typeof(string)
                    )
                    {
                        var nestedValue = value.ToObject(property.PropertyType, serializer);
                        property.SetValue(target, nestedValue);
                    }
                    else if (property.PropertyType == typeof(Guid))
                    {
                        property.SetValue(target, Guid.Parse(value.ToString()));
                    }
                    else
                    {
                        // Otherwise, deserialize the property normally
                        property.SetValue(
                            target,
                            value.ToObject(property.PropertyType, serializer)
                        );
                    }
                }
            }

            return target;
        }
    }
}
