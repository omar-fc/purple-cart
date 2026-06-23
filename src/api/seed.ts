import type { Category, Product, SubCategory } from '@/schemas'

/**
 * Initial demo catalog. This is the data the mock API seeds into localStorage
 * on first run. All copy is bilingual (en/ar) to exercise the i18n + RTL paths.
 *
 * Images are stable Unsplash URLs so the demo looks real out of the box.
 */

export const SEED_CATEGORIES: Category[] = [
  { id: 'cat_electronics', slug: 'electronics', name: { en: 'Electronics', ar: 'إلكترونيات' } },
  { id: 'cat_furniture', slug: 'furniture', name: { en: 'Furniture', ar: 'أثاث' } },
  { id: 'cat_apparel', slug: 'apparel', name: { en: 'Apparel', ar: 'ملابس' } },
]

export const SEED_SUBCATEGORIES: SubCategory[] = [
  { id: 'sub_laptops', categoryId: 'cat_electronics', slug: 'laptops', name: { en: 'Laptops', ar: 'حواسيب محمولة' } },
  { id: 'sub_phones', categoryId: 'cat_electronics', slug: 'phones', name: { en: 'Phones', ar: 'هواتف' } },
  { id: 'sub_audio', categoryId: 'cat_electronics', slug: 'audio', name: { en: 'Audio', ar: 'صوتيات' } },
  { id: 'sub_chairs', categoryId: 'cat_furniture', slug: 'chairs', name: { en: 'Chairs', ar: 'كراسي' } },
  { id: 'sub_desks', categoryId: 'cat_furniture', slug: 'desks', name: { en: 'Desks', ar: 'مكاتب' } },
  { id: 'sub_tshirts', categoryId: 'cat_apparel', slug: 'tshirts', name: { en: 'T-Shirts', ar: 'تيشيرتات' } },
]

const IMG = {
  laptop: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
  phone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  chair: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
  desk: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80',
  tshirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod_aurora_14',
    subCategoryId: 'sub_laptops',
    title: { en: 'Aurora 14 Ultrabook', ar: 'حاسوب أورورا 14 المحمول' },
    description: {
      en: 'A featherweight 14" ultrabook with all-day battery and a stunning OLED display.',
      ar: 'حاسوب محمول خفيف الوزن مقاس 14 بوصة ببطارية تدوم طوال اليوم وشاشة OLED مذهلة.',
    },
    basePrice: 1200,
    stockQuantity: 14,
    imageUrl: IMG.laptop,
    specs: {
      Display: { en: '14" OLED, 2.8K', ar: '14 بوصة OLED، 2.8K' },
      Weight: { en: '1.1 kg', ar: '1.1 كجم' },
      Battery: { en: 'Up to 18 hours', ar: 'حتى 18 ساعة' },
    },
    customizableComponents: [
      {
        id: 'cmp_ram',
        name: { en: 'Memory', ar: 'الذاكرة' },
        options: [
          { id: 'opt_ram_16', name: { en: '16 GB', ar: '16 جيجابايت' }, priceModifier: 0, isDefault: true },
          { id: 'opt_ram_32', name: { en: '32 GB', ar: '32 جيجابايت' }, priceModifier: 200, isDefault: false },
        ],
      },
      {
        id: 'cmp_storage',
        name: { en: 'Storage', ar: 'التخزين' },
        options: [
          { id: 'opt_ssd_512', name: { en: '512 GB SSD', ar: '512 جيجابايت SSD' }, priceModifier: 0, isDefault: true },
          { id: 'opt_ssd_1tb', name: { en: '1 TB SSD', ar: '1 تيرابايت SSD' }, priceModifier: 150, isDefault: false },
        ],
      },
    ],
  },
  {
    id: 'prod_nimbus_pro',
    subCategoryId: 'sub_phones',
    title: { en: 'Nimbus Pro Phone', ar: 'هاتف نيمبوس برو' },
    description: {
      en: 'Flagship camera system and a buttery 120Hz display in a titanium frame.',
      ar: 'نظام كاميرا رائد وشاشة سلسة بتردد 120 هرتز في إطار من التيتانيوم.',
    },
    basePrice: 899,
    stockQuantity: 0,
    imageUrl: IMG.phone,
    specs: {
      Screen: { en: '6.7" AMOLED 120Hz', ar: '6.7 بوصة AMOLED 120 هرتز' },
      Camera: { en: '50MP triple', ar: '50 ميجابكسل ثلاثية' },
    },
    customizableComponents: [
      {
        id: 'cmp_color',
        name: { en: 'Color', ar: 'اللون' },
        options: [
          { id: 'opt_color_black', name: { en: 'Graphite', ar: 'جرافيت' }, priceModifier: 0, isDefault: true },
          { id: 'opt_color_purple', name: { en: 'Deep Purple', ar: 'بنفسجي غامق' }, priceModifier: 0, isDefault: false },
        ],
      },
      {
        id: 'cmp_phone_storage',
        name: { en: 'Storage', ar: 'التخزين' },
        options: [
          { id: 'opt_p_256', name: { en: '256 GB', ar: '256 جيجابايت' }, priceModifier: 0, isDefault: true },
          { id: 'opt_p_512', name: { en: '512 GB', ar: '512 جيجابايت' }, priceModifier: 120, isDefault: false },
        ],
      },
    ],
  },
  {
    id: 'prod_echo_buds',
    subCategoryId: 'sub_audio',
    title: { en: 'Echo Noise-Cancelling Headphones', ar: 'سماعات إيكو لعزل الضوضاء' },
    description: {
      en: 'Immersive sound with adaptive noise cancellation and 40-hour battery life.',
      ar: 'صوت غامر مع عزل تكيفي للضوضاء وبطارية تدوم 40 ساعة.',
    },
    basePrice: 299,
    stockQuantity: 32,
    imageUrl: IMG.headphones,
    specs: {
      Battery: { en: '40 hours', ar: '40 ساعة' },
      Connectivity: { en: 'Bluetooth 5.3', ar: 'بلوتوث 5.3' },
    },
    customizableComponents: [
      {
        id: 'cmp_buds_color',
        name: { en: 'Color', ar: 'اللون' },
        options: [
          { id: 'opt_b_black', name: { en: 'Midnight', ar: 'أسود' }, priceModifier: 0, isDefault: true },
          { id: 'opt_b_white', name: { en: 'Ivory', ar: 'عاجي' }, priceModifier: 0, isDefault: false },
        ],
      },
    ],
  },
  {
    id: 'prod_ergo_chair',
    subCategoryId: 'sub_chairs',
    title: { en: 'ErgoFlow Office Chair', ar: 'كرسي مكتب إرجو فلو' },
    description: {
      en: 'Fully adjustable ergonomic chair with lumbar support and breathable mesh.',
      ar: 'كرسي مريح قابل للتعديل بالكامل مع دعم أسفل الظهر وشبكة قابلة للتنفس.',
    },
    basePrice: 420,
    stockQuantity: 8,
    imageUrl: IMG.chair,
    specs: {
      Material: { en: 'Breathable mesh', ar: 'شبكة قابلة للتنفس' },
      Warranty: { en: '5 years', ar: '5 سنوات' },
    },
    customizableComponents: [
      {
        id: 'cmp_armrest',
        name: { en: 'Armrests', ar: 'مساند الذراعين' },
        options: [
          { id: 'opt_arm_2d', name: { en: '2D Adjustable', ar: 'قابل للتعديل ثنائي الأبعاد' }, priceModifier: 0, isDefault: true },
          { id: 'opt_arm_4d', name: { en: '4D Adjustable', ar: 'قابل للتعديل رباعي الأبعاد' }, priceModifier: 60, isDefault: false },
        ],
      },
    ],
  },
  {
    id: 'prod_standing_desk',
    subCategoryId: 'sub_desks',
    title: { en: 'Altitude Standing Desk', ar: 'مكتب ألتيتيود القابل للوقوف' },
    description: {
      en: 'Electric height-adjustable desk with memory presets and a solid bamboo top.',
      ar: 'مكتب كهربائي قابل لتعديل الارتفاع مع إعدادات الذاكرة وسطح من الخيزران المتين.',
    },
    basePrice: 560,
    stockQuantity: 5,
    imageUrl: IMG.desk,
    specs: {
      'Top Material': { en: 'Solid bamboo', ar: 'خيزران متين' },
      'Height Range': { en: '60–125 cm', ar: '60–125 سم' },
    },
    customizableComponents: [
      {
        id: 'cmp_desk_size',
        name: { en: 'Tabletop Size', ar: 'حجم سطح الطاولة' },
        options: [
          { id: 'opt_size_120', name: { en: '120 × 60 cm', ar: '120 × 60 سم' }, priceModifier: 0, isDefault: true },
          { id: 'opt_size_140', name: { en: '140 × 70 cm', ar: '140 × 70 سم' }, priceModifier: 80, isDefault: false },
        ],
      },
    ],
  },
  {
    id: 'prod_classic_tee',
    subCategoryId: 'sub_tshirts',
    title: { en: 'Classic Organic Tee', ar: 'تيشيرت عضوي كلاسيكي' },
    description: {
      en: 'Soft 100% organic cotton t-shirt with a relaxed, everyday fit.',
      ar: 'تيشيرت ناعم من القطن العضوي 100٪ بقصة مريحة للاستخدام اليومي.',
    },
    basePrice: 29,
    stockQuantity: 120,
    imageUrl: IMG.tshirt,
    specs: {
      Material: { en: '100% organic cotton', ar: 'قطن عضوي 100٪' },
      Fit: { en: 'Relaxed', ar: 'مريح' },
    },
    customizableComponents: [
      {
        id: 'cmp_size',
        name: { en: 'Size', ar: 'المقاس' },
        options: [
          { id: 'opt_s', name: { en: 'S', ar: 'صغير' }, priceModifier: 0, isDefault: false },
          { id: 'opt_m', name: { en: 'M', ar: 'متوسط' }, priceModifier: 0, isDefault: true },
          { id: 'opt_l', name: { en: 'L', ar: 'كبير' }, priceModifier: 0, isDefault: false },
          { id: 'opt_xl', name: { en: 'XL', ar: 'كبير جداً' }, priceModifier: 3, isDefault: false },
        ],
      },
      {
        id: 'cmp_tee_color',
        name: { en: 'Color', ar: 'اللون' },
        options: [
          { id: 'opt_t_purple', name: { en: 'Purple', ar: 'بنفسجي' }, priceModifier: 0, isDefault: true },
          { id: 'opt_t_white', name: { en: 'White', ar: 'أبيض' }, priceModifier: 0, isDefault: false },
          { id: 'opt_t_black', name: { en: 'Black', ar: 'أسود' }, priceModifier: 0, isDefault: false },
        ],
      },
    ],
  },
]
