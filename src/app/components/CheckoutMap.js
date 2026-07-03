"use client";

import React, { useEffect, useRef } from "react";

export default function CheckoutMap({ onSelectAddress, currentAddress }) {
  // 1. ХУКИ СТРОГО НА САМОМ ВЕРХУ КОМПОНЕНТА
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const placemarkInstance = useRef(null);

  useEffect(() => {
    // Безопасная проверка серверного окружения (внутри эффекта, так можно)
    if (typeof window === "undefined") return;

    // Проверяем, не загружен ли скрипт уже
    if (!document.getElementById("yandex-maps-script")) {
      const script = document.createElement("script");
      script.id = "yandex-maps-script";
      // Поставь сюда свой реальный API-ключ Яндекса вместо ТВОЙ_API_КЛЮЧ
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=ТВОЙ_API_КЛЮЧ&lang=ru_RU`;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        initMap();
      };
    } else if (window.ymaps) {
      initMap();
    }

    function initMap() {
      const ymaps = window.ymaps;
      if (!ymaps || !mapRef.current || mapInstance.current) return;

      ymaps.ready(() => {
        const map = new ymaps.Map(mapRef.current, {
          center: [41.3111, 69.2406], // Центр Ташкента
          zoom: 12,
          controls: ["zoomControl", "geolocationControl"],
        });

        mapInstance.current = map;

        // Обработчик клика на карту
        map.events.add("click", function (e) {
          const coords = e.get("coords");

          if (placemarkInstance.current) {
            placemarkInstance.current.geometry.setCoordinates(coords);
          } else {
            placemarkInstance.current = new ymaps.Placemark(
              coords,
              {},
              { preset: "islands#violetDotIconWithCaption" },
            );
            map.geoObjects.add(placemarkInstance.current);
          }

          ymaps.geocode(coords).then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            if (firstGeoObject) {
              const addressString = firstGeoObject.getAddressLine();
              onSelectAddress(addressString);
            }
          });
        });
      });
    }

    return () => {
      // Чистим карту при закрытии панели
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
        placemarkInstance.current = null;
      }
    };
  }, [onSelectAddress]);

  // 2. ВЫВОД РАЗМЕТКИ БЕЗ СЛУЧАЙНЫХ РАННИХ RETURN-ОВ
  return (
    <div className="w-full h-[320px] rounded-xl overflow-hidden border border-primary/20 shadow-md mt-2">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
