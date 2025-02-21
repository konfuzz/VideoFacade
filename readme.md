# Video Facade Web Component

Video Facade - это кастомный веб-компонент для унифицированного воспроизведения видео из различных источников (native HTML5 video, YouTube, Vimeo).

## Установка

```html
<script src="video-facade.js"></script>
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
| lazy | boolean | false | Отложенная загрузка видео |
| autopause | boolean | false | Автопауза при скролле из вида |
| threshold | number | 0 | Порог видимости для autopause (0-1) |
| pauseonclick | boolean | false | Пауза по клику на видео |

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

## Кастомизация кнопки воспроизведения

Вы можете заменить стандартную кнопку воспроизведения своей:

```html
<video-facade src="video.mp4">
  <button slot="play-button" class="custom-button">
    Воспроизвести
  </button>
</video-facade>
```

## События

Компонент поддерживает стандартные события видео:
- play
- pause
- ended
- timeupdate
- loadeddata

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

## Браузерная поддержка

Компонент работает во всех современных браузерах, поддерживающих Web Components:
- Chrome 67+
- Firefox 63+
- Safari 12.1+
- Edge 79+

## Известные ограничения

1. YouTube API требует ID видео вместо полного URL
2. Некоторые функции могут быть ограничены политиками автовоспроизведения браузеров
3. Для корректной работы lazy loading требуется поддержка IntersectionObserver

## Лицензия

MIT License