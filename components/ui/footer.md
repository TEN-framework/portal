# Footer Component

A modern, responsive footer component for the TEN Framework portal.

## Features

- **Responsive Design**: Adapts to different screen sizes with a mobile-first approach
- **Internationalization**: Fully supports English and Chinese translations via next-intl
- **Social Links**: Includes GitHub, Twitter/X, and Discord integration
- **Organized Sections**:
  - Product links (TEN Framework, TEN Agent, TEN VAD, TEN Turn Detection)
  - Resources (Documentation, Blog, Hugging Face Space)
  - Community links (GitHub, Discord, Twitter)
- **Theme Support**: Works seamlessly with light and dark modes
- **Consistent Styling**: Matches the existing design system using Tailwind CSS

## Usage

The footer is automatically included in the home layout:

```tsx
import { Footer } from '@/components/ui/footer'

export default function Layout() {
  return (
    <div>
      {/* Your content */}
      <Footer />
    </div>
  )
}
```

## Customization

You can add a custom className to adjust spacing or styling:

```tsx
<Footer className="mt-20" />
```

## Translations

All footer text is managed through the translation files:
- English: `/messages/en.json` → `footer` key
- Chinese: `/messages/cn.json` → `footer` key

To modify footer text, update these translation files.
