
using UnityEditor;
using UnityEngine;
using TextEditor = UnityEditor.UI.TextEditor;

using Imba.UI;

namespace Imba.Editor.UI
{
    [CanEditMultipleObjects]
    [CustomEditor(typeof(UITextPic))]
    public class TextPicEditor : TextEditor
    {

        private SerializedProperty ImageScalingFactorProp;
        private SerializedProperty hyperlinkColorProp;
        private SerializedProperty imageOffsetProp;
        private SerializedProperty iconList;

        protected override void OnEnable()
        {
            base.OnEnable();
            ImageScalingFactorProp = serializedObject.FindProperty("ImageScalingFactor");
            hyperlinkColorProp = serializedObject.FindProperty("hyperlinkColor");
            imageOffsetProp = serializedObject.FindProperty("imageOffset");
            iconList = serializedObject.FindProperty("inspectorIconList");
        }

        public override void OnInspectorGUI()
        {
            base.OnInspectorGUI();
            serializedObject.Update();
            EditorGUILayout.PropertyField(imageOffsetProp, new GUIContent("Image Offset"));
            EditorGUILayout.PropertyField(ImageScalingFactorProp, new GUIContent("Image Scaling Factor"));
            EditorGUILayout.PropertyField(hyperlinkColorProp, new GUIContent("Hyperlink Color"));
            EditorGUILayout.PropertyField(iconList, new GUIContent("Icon List"), true);
            serializedObject.ApplyModifiedProperties();
            UITextPic myScript = (UITextPic)target;
            if (GUILayout.Button("Load"))
            {
                myScript.text = " dasdadad -lk- dasdadada";

            }
        }
    }
}