using UnityEditor;
using UnityEngine;
using System.Collections.Generic;
using System.Reflection;

using Imba.UI;

namespace Imba.Editor.UI
{
    /// <summary>
    /// Tools for the editor
    /// </summary>

    public static class UIEditorTools
    {
        static bool minimalisticLook = false;

        static public SerializedProperty DrawProperty(SerializedObject serializedObject, string property, params GUILayoutOption[] options)
        {
            return DrawProperty(null, serializedObject, property, false, options);
        }

        /// <summary>
        /// Helper function that draws a serialized property.
        /// </summary>

        static public SerializedProperty DrawProperty(string label, SerializedObject serializedObject, string property, params GUILayoutOption[] options)
        {
            return DrawProperty(label, serializedObject, property, false, options);
        }

        /// <summary>
        /// Helper function that draws a serialized property.
        /// </summary>

        static public SerializedProperty DrawPaddedProperty(SerializedObject serializedObject, string property, params GUILayoutOption[] options)
        {
            return DrawProperty(null, serializedObject, property, true, options);
        }

        /// <summary>
        /// Helper function that draws a serialized property.
        /// </summary>

        static public SerializedProperty DrawPaddedProperty(string label, SerializedObject serializedObject, string property, params GUILayoutOption[] options)
        {
            return DrawProperty(label, serializedObject, property, true, options);
        }

        /// <summary>
        /// Helper function that draws a serialized property.
        /// </summary>

        static public SerializedProperty DrawProperty(string label, SerializedObject serializedObject, string property, bool padding, params GUILayoutOption[] options)
        {
            SerializedProperty sp = serializedObject.FindProperty(property);

            if (sp != null)
            {
                if (minimalisticLook) padding = false;

                if (padding) EditorGUILayout.BeginHorizontal();

                if (label != null) EditorGUILayout.PropertyField(sp, new GUIContent(label), options);
                else EditorGUILayout.PropertyField(sp, options);

                if (padding)
                {
                    UIEditorTools.DrawPadding();
                    EditorGUILayout.EndHorizontal();
                }
            }
            return sp;
        }

        /// <summary>
        /// Helper function that draws a serialized property.
        /// </summary>

        static public void DrawProperty(string label, SerializedProperty sp, params GUILayoutOption[] options)
        {
            DrawProperty(label, sp, true, options);
        }

        /// <summary>
        /// Helper function that draws a serialized property.
        /// </summary>

        static public void DrawProperty(string label, SerializedProperty sp, bool padding, params GUILayoutOption[] options)
        {
            if (sp != null)
            {
                if (padding) EditorGUILayout.BeginHorizontal();

                if (label != null) EditorGUILayout.PropertyField(sp, new GUIContent(label), options);
                else EditorGUILayout.PropertyField(sp, options);

                if (padding)
                {
                    UIEditorTools.DrawPadding();
                    EditorGUILayout.EndHorizontal();
                }
            }
        }

        static public void DrawRectProperty(string name, SerializedObject serializedObject, string field)
        {
            DrawRectProperty(name, serializedObject, field, 56f, 18f);
        }

        /// <summary>
        /// Helper function that draws a compact Rect.
        /// </summary>

        static public void DrawRectProperty(string name, SerializedObject serializedObject, string field, float labelWidth, float spacing)
        {
            if (serializedObject.FindProperty(field) != null)
            {
                GUILayout.BeginHorizontal();
                {
                    GUILayout.Label(name, GUILayout.Width(labelWidth));

                    UIEditorTools.SetLabelWidth(20f);
                    GUILayout.BeginVertical();
                    UIEditorTools.DrawProperty("X", serializedObject, field + ".x", GUILayout.MinWidth(50f));
                    UIEditorTools.DrawProperty("Y", serializedObject, field + ".y", GUILayout.MinWidth(50f));
                    GUILayout.EndVertical();

                    UIEditorTools.SetLabelWidth(50f);
                    GUILayout.BeginVertical();
                    UIEditorTools.DrawProperty("Width", serializedObject, field + ".width", GUILayout.MinWidth(80f));
                    UIEditorTools.DrawProperty("Height", serializedObject, field + ".height", GUILayout.MinWidth(80f));
                    GUILayout.EndVertical();

                    UIEditorTools.SetLabelWidth(80f);
                    if (spacing != 0f) GUILayout.Space(spacing);
                }
                GUILayout.EndHorizontal();
            }
        }

        /// <summary>
        /// Draw 18 pixel padding on the right-hand side. Used to align fields.
        /// </summary>

        static public void DrawPadding()
        {
            if (!minimalisticLook)
                GUILayout.Space(18f);
        }

        /// <summary>
        /// Unity 4.3 changed the way LookLikeControls works.
        /// </summary>
        static public void SetLabelWidth(float width)
        {
            EditorGUIUtility.labelWidth = width;
        }

        static public void RegisterUndo(string name, params Object[] objects)
        {
            if (objects != null && objects.Length > 0)
            {
                UnityEditor.Undo.RecordObjects(objects, name);

                foreach (Object obj in objects)
                {
                    if (obj == null) continue;
                    EditorUtility.SetDirty(obj);
                }
            }
        }
        
     
        
    }
}