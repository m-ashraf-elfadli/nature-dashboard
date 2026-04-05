import { BlogCategory, BlogPost } from '../models/blogs.model';

/** Placeholder thumbnails (absolute URLs work with reusable-table image column). */
const img = (seed: number) => `https://picsum.photos/seed/natureblog${seed}/96/64`;

export const BLOG_CATEGORY_TYPES = [
  { id: 'water', labelKey: 'blogs.category_types.water' },
  { id: 'land', labelKey: 'blogs.category_types.land' },
  { id: 'tech', labelKey: 'blogs.category_types.technology' },
  { id: 'env', labelKey: 'blogs.category_types.environmental' },
] as const;

export function createInitialDummyCategories(): BlogCategory[] {
  return [
    {
      id: '1',
      name: 'Marine Conservation',
      name_en: 'Marine Conservation',
      name_ar: 'الحفاظ على البيئة البحرية',
      type_id: 'water',
      type_label: '',
      image: img(1),
      created_at: '2024-12-12',
      status: true,
    },
    {
      id: '2',
      name: 'Worldwide',
      name_en: 'Worldwide',
      name_ar: 'عالمي',
      type_id: 'land',
      type_label: '',
      image: img(2),
      created_at: '2024-11-01',
      status: true,
    },
    {
      id: '3',
      name: 'Technology',
      name_en: 'Technology',
      name_ar: 'تقنية',
      type_id: 'tech',
      type_label: '',
      image: img(3),
      created_at: '2024-10-15',
      status: false,
    },
    {
      id: '4',
      name: 'Environmental',
      name_en: 'Environmental',
      name_ar: 'بيئي',
      type_id: 'env',
      type_label: '',
      image: img(4),
      created_at: '2024-09-20',
      status: true,
    },
  ];
}

export function createInitialDummyPosts(): BlogPost[] {
  return [
    {
      id: 'p1',
      title: 'Restoring coastal mangroves',
      title_en: 'Restoring coastal mangroves',
      title_ar: 'استعادة أشجار المانغروف الساحلية',
      category_id: '1',
      category_name: 'Marine Conservation',
      views: 12_400,
      localeComplete: { en: true, ar: true },
      image: img(10),
      created_at: '2024-12-01',
      status: true,
      sections: [
        {
          enabled: true,
          title: 'Why mangroves matter',
          subtitle_html: '<p>Coastal ecosystems support biodiversity and protect shorelines.</p>',
          image: img(101),
          quote: 'Nature is our ally.',
          tags: 'mangroves, coast',
        },
      ],
    },
    {
      id: 'p2',
      title: 'Green tech in agriculture',
      title_en: 'Green tech in agriculture',
      title_ar: 'التقنية الخضراء في الزراعة',
      category_id: '3',
      category_name: 'Technology',
      views: 900,
      localeComplete: { en: true, ar: false },
      image: img(11),
      created_at: '2024-11-18',
      status: true,
      sections: [
        {
          enabled: true,
          title: 'Overview',
          subtitle_html: '<p>Technology can reduce waste in farming.</p>',
          image: img(102),
          quote: '',
          tags: 'agtech',
        },
      ],
    },
  ];
}
