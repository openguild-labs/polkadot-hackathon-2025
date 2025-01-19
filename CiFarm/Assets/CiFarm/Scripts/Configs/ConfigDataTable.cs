using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using Newtonsoft.Json;
using UnityEngine;

namespace DuckSurvivor.Scripts.Configs
{
    public interface ISGConfigDataTable
    {
        void LoadFromAssetPath(string path, bool useAppDataPath = true);
        void Clear();
    }

    public class SgConfigDataTable<TDataRecord> : ISGConfigDataTable where TDataRecord : class, new()
    {
        public bool       isLoaded;
        List<TDataRecord> records = new List<TDataRecord>();

        public class IndexField<TIndex> : Dictionary<TIndex, List<TDataRecord>>
        {
        };

        Dictionary<string, object> rebuildIndex = new Dictionary<string, object>();

        List<FieldInfo> fields;

        public List<TDataRecord> Records
        {
            get { return records; }
        }

        public SgConfigDataTable()
        {
            ReadFieldInfo();
        }

        void ReadFieldInfo()
        {
            Type        type     = typeof(TDataRecord);
            FieldInfo[] fieldArr = type.GetFields();
            fields = new List<FieldInfo>();
            foreach (FieldInfo filedInfo in fieldArr)
                if (!filedInfo.IsPrivate && !filedInfo.IsNotSerialized)
                    fields.Add(filedInfo);
        }

        public void LoadFromAssetPath(string path, bool useAppDataPath = true)
        {
            if (fields == null || fields.Count == 0)
                return;

            TextReader reader; // NOTE: TextReader, superclass of StreamReader and StringReader
            var theSourceFile = useAppDataPath
                ? new FileInfo(Application.dataPath + "/" + path + ".txt")
                : new FileInfo(path);

            if (theSourceFile.Exists)
            {
                reader = theSourceFile.OpenText(); // returns StreamReader
            }
            else
            {
                TextAsset textData = (TextAsset)Resources.Load(path, typeof(TextAsset));
                reader = new StringReader(textData.text); // returns StringReader
            }

            var readLine = reader.ReadLine(); // skip firstLine (Header)
            while (true)
            {
                readLine = reader.ReadLine();
                if (string.IsNullOrEmpty(readLine))
                {
                    break;
                }

                var record  = new TDataRecord();
                var columns = readLine.Split('\t');
                var i       = 0;
                foreach (FieldInfo field in fields)
                {
                    if (fields.IndexOf(field) < columns.Length)
                    {
                        object convert = ConvertData(columns[i], field.FieldType);
                        if (convert != null)
                            field.SetValue(record, convert);
                    }

                    i++;
                }

                records.Add(record);
            }

            RebuildIndex();
            isLoaded = true;
        }

        public void LoadFromTextAsset(TextAsset textAsset)
        {
            TextReader reader = new StringReader(textAsset.text); // returns StringReader
            if (reader == null)
            {
                Debug.Log("not found or not readable");
            }
            else
            {
                int    line = 0;
                string txt  = reader.ReadLine(); // bo dong dau
                while (true)
                {
                    txt = reader.ReadLine();
                    line++;
                    if (txt == null) break;
                    TDataRecord record = new TDataRecord(); //Activator.CreateInstance<TDataRecord>();

                    string[] columns = txt.Split('\t');

                    if (columns == null || columns.Length < fields.Count)
                    {
                        Debug.LogError("Load textasset " + textAsset.name + " line " + line + " error " +
                                       columns.Length + "," + fields.Count);
                        continue;
                    }

                    int  i     = 0;
                    bool error = false;

                    foreach (FieldInfo field in fields)
                    {
                        object convert = ConvertData(columns[i], field.FieldType);
                        if (convert != null)
                            field.SetValue(record, convert);
                        else
                        {
                            error = true;
                            break;
                        }

                        i++;
                    }

                    if (error)
                    {
                        Debug.LogError("Load textasset " + textAsset.name + " line " + line + " error");
                        continue;
                    }

                    records.Add(record);
                }

                RebuildIndex();
                isLoaded = true;
            }
        }

        public void LoadFromJson(string json)
        {
            if (string.IsNullOrEmpty(json))
            {
                Debug.LogError("json not found !!!");
                return;
            }

            var dict = JsonConvert.DeserializeObject<Dictionary<string, List<TDataRecord>>>(json);
            records = dict["Records"];
            RebuildIndex();
        }

        public void Clear()
        {
            records.Clear();
            rebuildIndex.Clear();
        }

        protected virtual void RebuildIndex()
        {
        }

        protected void RebuildIndexByField<TIndex>(string fieldName)
        {
            Type      recordType = typeof(TDataRecord);
            FieldInfo fieldInfo  = recordType.GetField(fieldName);
            if (fieldInfo == null)
                throw new Exception("Field [" + fieldName + "] not found");
            IndexField<TIndex> indexField = new IndexField<TIndex>();
            rebuildIndex[fieldName] = indexField;
            foreach (TDataRecord record in records)
            {
                var fieldValue = (TIndex)fieldInfo.GetValue(record);

                List<TDataRecord> indexedValue;
                if (!indexField.TryGetValue(fieldValue, out indexedValue))
                {
                    indexedValue           = new List<TDataRecord>();
                    indexField[fieldValue] = indexedValue;
                }

                indexedValue.Add(record);
            }
        }

        public TDataRecord GetRecordByIndex<TIndex>(string fieldName, TIndex compareValue)
        {
            object dic = null;
            if (rebuildIndex.TryGetValue(fieldName, out dic))
            {
                IndexField<TIndex> indexField = (IndexField<TIndex>)dic;
                List<TDataRecord>  resultList = null;
                if (indexField.TryGetValue(compareValue, out resultList))
                    if (resultList.Count > 0)
                        return resultList[0];

                return null;
            }

            return null;
        }

        public List<TDataRecord> GetRecordsByIndex<TIndex>(string fieldName, TIndex compareValue)
        {
            object dic = null;
            if (rebuildIndex.TryGetValue(fieldName, out dic))
            {
                IndexField<TIndex> indexField = (IndexField<TIndex>)dic;
                List<TDataRecord>  resultList = null;
                if (indexField.TryGetValue(compareValue, out resultList))
                    if (resultList.Count > 0)
                        return resultList;

                return null;
            }

            return null;
        }

        private object ConvertData(string value, Type t)
        {
            if (t.IsEnum)
            {
                Array arr = Enum.GetValues(t);
                if (string.IsNullOrEmpty(value))
                {
                    return arr.GetValue(0);
                }
                foreach (object item in arr)
                {
                    if (item.ToString().ToLower().Equals(value.Trim().ToLower()))
                        return item;
                }
            }
            else
            {
                TypeCode typeCode = Type.GetTypeCode(t);
                switch (typeCode)
                {
                    case TypeCode.Int32:
                    {
                        if (int.TryParse(value, out var intResult))
                        {
                            return intResult;
                        }

                        return null;
                    }

                    case TypeCode.UInt32:
                    {
                        if (uint.TryParse(value, out var uintResult))
                        {
                            return uintResult;
                        }

                        return null;
                    }
                    case TypeCode.Int64:
                    {
                        if (long.TryParse(value, out var longResult))
                        {
                            return longResult;
                        }

                        return null;
                    }
                    case TypeCode.Int16:
                    {
                        if (short.TryParse(value, out var shortResult))
                        {
                            return shortResult;
                        }

                        return null;
                    }
                    case TypeCode.Single:
                    case TypeCode.Decimal:
                    {
                        if (float.TryParse(value, out var floatResult))
                        {
                            return floatResult;
                        }

                        return null;
                    }
                    case TypeCode.String:
                    {
                        string[] regex = { @"\n" };
                        string[] temp2 = value.Split(regex, StringSplitOptions.None);
                        value = "";
                        for (int i = 0; i < temp2.Length; i++)
                        {
                            if (i == temp2.Length - 1)
                            {
                                value += temp2[i];
                                break;
                            }

                            value += temp2[i] + "\n";
                        }

                        {
                            return value;
                        }
                    }
                    case TypeCode.Boolean:
                    {
                        if (bool.TryParse(value, out var boolResult))
                        {
                            return boolResult;
                        }

                        if (value == "0")
                        {
                            return false;
                        }

                        if (value == "1")
                        {
                            return true;
                        }

                        return null;
                    }

                    case TypeCode.Double:
                    {
                        if (double.TryParse(value, out var doubleResult))
                        {
                            return doubleResult;
                        }

                        return null;
                    }
                    case TypeCode.DateTime:
                    {
                        DateTime dateTimeResult;
                        if (DateTime.TryParseExact(value, "yyyy-MM-dd HH:mm:ss,fff",
                                System.Globalization.CultureInfo.InvariantCulture,
                                System.Globalization.DateTimeStyles.None,
                                out dateTimeResult))
                        {
                            return dateTimeResult;
                        }

                        return null;
                    }

                    default:
                        return null;
                }
            }

            return null;
        }
    }
}