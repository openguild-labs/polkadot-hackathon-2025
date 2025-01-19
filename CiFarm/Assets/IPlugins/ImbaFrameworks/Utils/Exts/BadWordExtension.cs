using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Text.RegularExpressions;
using UnityEngine;

namespace Imba.Utils
{
	public static class BadWordExtension
	{
		const string CensoredText = "*beep*";
		const string PatternTemplate = @"{0}([""!#$%&'()*+,./:;<=>?@\^_`~-]*)";

		const string ACCEPT_CHARS =
				" 0123456789AÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶBCDĐEÉÈẺẼẸÊẾỀỂỄỆFGHIÍÌỈĨỊJKLMNOÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢPQRSTUÚÙỦŨỤƯỨỪỬỮỰVWXYÝỲỶỸỴZ^_aáàảãạâầấẩẫậăắằẳẵặbcdđeéèẻẽẹêếềểễệfghiíìỉĩịjklmnoóòỏõọôốồổỗộơớờởỡợpqrstuúùủũụưứừửữựvwxyýỳỷỹỵz~"
			;

		const RegexOptions Options = RegexOptions.IgnoreCase;

		static IEnumerable<Regex> badWordMatchers;


		public static bool initialized { get; private set; }

		public static void Init(List<string> badWords)
		{
			if (badWords == null)
			{
#if UNITY_EDITOR
            Debug.Log("Badword[] Null");
#endif
				return;
			}
			if (badWords.Count == 0)
			{
#if UNITY_EDITOR
            Debug.Log("Badword[] Empty");
#endif
				return;
			}
			badWordMatchers = badWords.Select(x => new Regex(AddRegex(x), Options));
			initialized = true;
		}

		public static bool IsMatchAcceptChars(this string input)
		{
			foreach (var c in input)
			{
				if (!ACCEPT_CHARS.Contains(c))
					return false;
			}
			return true;
		}

		public static bool IsContainBadwords(this string input)
		{
			return badWordMatchers.Any(reg => reg.IsMatch(input));
		}

		public static string FilterBadwords(this string input)
		{
			if (badWordMatchers == null || string.IsNullOrEmpty(input) || !initialized)
				return input;
			if (badWordMatchers.Count() == 0)
				return input;

			return badWordMatchers.Aggregate(input, (current, matcher) => matcher.Replace(current, CensoredText));
		}

		private static string AddRegex(string word)
		{
			string wordRegx = "";
			foreach (char c in word)
				wordRegx += string.Format(PatternTemplate, c);
			return @"\b(" + wordRegx + @")\b?";
		}

	}
}