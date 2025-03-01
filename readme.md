# Video Facade Web Component

Video Facade - это кастомный веб-компонент для унифицированного воспроизведения видео из различных источников (native HTML5 video, YouTube, Vimeo).

## Установка

Можно скачать скрипт и подключить локально.

```html
<script src="video-facade.min.js"></script>
```

Можно подключить скрипт из CDN.

```html
<script src="https://cdn.jsdelivr.net/gh/konfuzz/VideoFacade@latest/dist/video-facade.min.js"></script>
```

## Использование

```html
<!-- Нативное видео -->
<video-facade
  src="video.mp4"
  type="native"
  poster="preview.jpg"
  options="muted autoplay"
>
</video-facade>

<!-- YouTube видео -->
<video-facade
  src="dQw4w9WgXcQ" 
  type="youtube"
  poster="preview.jpg"
  options="autoplay controls"
>
</video-facade>

<!-- Vimeo видео -->
<video-facade
  src="https://vimeo.com/123456789"
  type="vimeo"
  poster="preview.jpg"
  options="autoplay muted"
>
</video-facade>
```

## Атрибуты

| Атрибут | Тип | По умолчанию | Описание |
|---------|-----|--------------|----------|
| src | string | - | URL видео или ID для YouTube |
| type | string | "native" | Тип плеера: "native", "youtube" или "vimeo" |
| poster | string | - | URL превью изображения |
| options | string | - | Список опций через пробел |
| lazy | string | - | Ленивая загрузка, по-умолчанию отсутствует. Возможные значения: "inview" (при попадании в зону видимости), "onload" (после загрузки страницы) |
| autopause | boolean | false | Автопауза при выходе видео из зоны видимости |
| threshold | number | 0 | Порог видимости для lazy и autopause (0-1) |
| pauseonclick | boolean | false | Пауза по клику на видео (может быть необходимо при отключенных controls) |
| bg | boolean | false | Автоматически добавляет muted и autoplay к опциям видео и скрывает кнопку воспроизведения |

## Опции воспроизведения

### Native Video
- muted
- autoplay
- loop
- controls
- playsinline

### YouTube
- autoplay
- muted
- controls
- loop
- rel
- playsinline

### Vimeo
- autoplay
- muted
- controls
- loop
- playsinline

## Методы

### play()
Запускает воспроизведение видео.

### pause()
Приостанавливает воспроизведение видео.

## События

### videoloaded
Используется для обработки события при загрузке видео.

## Кастомизация кнопки воспроизведения

Вы можете заменить стандартную кнопку воспроизведения своей:

```html
<video-facade src="video.mp4">
  <button slot="play-button" class="custom-button">
    ▶️ // Можно разместить SVG или другой элемент
  </button>
</video-facade>
```

## Управление стилями

Управление стилями контейнера видео и кастомной кнопки воспроизведения можно производить с помощью CSS свойств, например:

```css
video-facade {
  border: 1px solid red;
  border-radius: 4px;
}

.custom-button {
  background: rgba(255, 0, 0, 0.8);
  position:absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  transform-origin: center;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: transform 0.2s;
}

```

Видео внутри контейнера не поддаётся дополнительной стилизации.

## Примеры

### Базовое использование
```html
<video-facade
  src="video.mp4"
  poster="preview.jpg"
>
</video-facade>
```

### YouTube с автовоспроизведением
```html
<video-facade
  src="dQw4w9WgXcQ"
  type="youtube"
  options="autoplay muted"
  poster="preview.jpg"
>
</video-facade>
```

### Vimeo с отложенной загрузкой
```html
<video-facade
  src="https://vimeo.com/123456789"
  type="vimeo"
  lazy
  autopause
  poster="preview.jpg"
>
</video-facade>
```

