using System.Collections;
using System.Collections.Generic;
using CiFarm.Scripts.Utilities;
using DG.Tweening;
using UnityEngine;
using UnityEngine.Events;

namespace CiFarm.Scripts.Vfx
{
    public class ExperienceEf : MonoBehaviour
    {
        [SerializeField] private GameObject starEf;
        [SerializeField] private int        numberStarSpawnMin = 3;
        [SerializeField] private int        numberStarMax      = 7;

        private Transform _targetPosition;

        private List<GameObject> _starTracking;

        private UnityAction _onCompleteAnimation;

        private void Awake()
        {
            _starTracking = new List<GameObject>();
        }

        public void InitEf(Transform targetPositionFLyTo, int NumberOfEf, UnityAction onCompleteAnimation)
        {
            _starTracking.Clear();
            _targetPosition      = targetPositionFLyTo;
            _onCompleteAnimation = onCompleteAnimation;

            var spawnNumber = Random.Range(numberStarSpawnMin, numberStarMax);

            for (int i = 0; i < NumberOfEf; i++)
            {
                var objet = SimplePool.Spawn(starEf, transform.position, Quaternion.identity);
                objet.SetParent(transform);
                objet.transform.localScale = Vector3.one;
                _starTracking.Add(objet);
            }

            StartCoroutine(DoAnimation());
        }

        public IEnumerator DoAnimation()
        {
            foreach (var starObj in _starTracking)
            {
                var tfs = starObj.transform;
                tfs.localScale = Vector3.zero;

                var flyPos1 = new Vector2(tfs.position.x + Random.Range(-200, 200),
                    tfs.position.y + Random.Range(-200, 200));
                tfs.DOMove(flyPos1, 0.5f);
                tfs.DOScale(Vector3.one, 0.5f).OnComplete(() =>
                {
                    tfs.transform.DOScale(Vector3.one * 0.2f, 0.5f);
                    tfs.transform.DOMove(_targetPosition.position, 0.5f).OnComplete(() =>
                    {
                        SimplePool.Despawn(tfs.gameObject);
                    });
                });
            }

            yield return new WaitForSeconds(1.5f);
            SimplePool.Despawn(gameObject);
            _onCompleteAnimation?.Invoke();
        }
    }
}