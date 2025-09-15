import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@solevaeg.com';
  const adminPassword = process.env.ADMIN_PASSWORD || '?3aeeSjqq';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
      role: 'OWNER',
      isActive: true,
      isVerified: true,
      emailVerifiedAt: new Date()
    }
  });

  console.log('✅ Admin user created:', admin.email);

  // Seed Egyptian Governorates
  const governoratesData = [
    { name: { ar: 'القاهرة', en: 'Cairo' }, code: 'CAI', shippingCost: 45 },
    { name: { ar: 'الجيزة', en: 'Giza' }, code: 'GIZ', shippingCost: 45 },
    { name: { ar: 'الإسكندرية', en: 'Alexandria' }, code: 'ALX', shippingCost: 55 },
    { name: { ar: 'القليوبية', en: 'Qalyubia' }, code: 'QLY', shippingCost: 50 },
    { name: { ar: 'الشرقية', en: 'Sharqia' }, code: 'SHQ', shippingCost: 60 },
    { name: { ar: 'المنوفية', en: 'Monufia' }, code: 'MNF', shippingCost: 55 },
    { name: { ar: 'الغربية', en: 'Gharbia' }, code: 'GHR', shippingCost: 60 },
    { name: { ar: 'الدقهلية', en: 'Dakahlia' }, code: 'DKH', shippingCost: 65 },
    { name: { ar: 'كفر الشيخ', en: 'Kafr El Sheikh' }, code: 'KFS', shippingCost: 70 },
    { name: { ar: 'دمياط', en: 'Damietta' }, code: 'DMT', shippingCost: 70 },
    { name: { ar: 'البحيرة', en: 'Beheira' }, code: 'BHR', shippingCost: 65 },
    { name: { ar: 'الإسماعيلية', en: 'Ismailia' }, code: 'ISM', shippingCost: 65 },
    { name: { ar: 'بورسعيد', en: 'Port Said' }, code: 'PTS', shippingCost: 70 },
    { name: { ar: 'السويس', en: 'Suez' }, code: 'SUZ', shippingCost: 65 },
    { name: { ar: 'شمال سيناء', en: 'North Sinai' }, code: 'NSI', shippingCost: 100 },
    { name: { ar: 'جنوب سيناء', en: 'South Sinai' }, code: 'SSI', shippingCost: 120 },
    { name: { ar: 'الفيوم', en: 'Fayyum' }, code: 'FYM', shippingCost: 60 },
    { name: { ar: 'بني سويف', en: 'Beni Suef' }, code: 'BNS', shippingCost: 65 },
    { name: { ar: 'المنيا', en: 'Minya' }, code: 'MNY', shippingCost: 70 },
    { name: { ar: 'أسيوط', en: 'Asyut' }, code: 'AST', shippingCost: 80 },
    { name: { ar: 'سوهاج', en: 'Sohag' }, code: 'SOH', shippingCost: 85 },
    { name: { ar: 'قنا', en: 'Qena' }, code: 'QNA', shippingCost: 90 },
    { name: { ar: 'الأقصر', en: 'Luxor' }, code: 'LUX', shippingCost: 95 },
    { name: { ar: 'أسوان', en: 'Aswan' }, code: 'ASW', shippingCost: 100 },
    { name: { ar: 'البحر الأحمر', en: 'Red Sea' }, code: 'RSA', shippingCost: 120 },
    { name: { ar: 'الوادي الجديد', en: 'New Valley' }, code: 'NVL', shippingCost: 130 },
    { name: { ar: 'مطروح', en: 'Matrouh' }, code: 'MTR', shippingCost: 110 }
  ];

  const governorates = [];
  for (const govData of governoratesData) {
    const governorate = await prisma.governorate.upsert({
      where: { code: govData.code },
      update: {},
      create: {
        name: govData.name,
        code: govData.code,
        shippingCost: govData.shippingCost
      }
    });
    governorates.push(governorate);
  }

  console.log('✅ Governorates seeded:', governorates.length);

  // Seed some centers for Cairo and Giza
  const cairoGov = governorates.find(g => g.code === 'CAI');
  const gizaGov = governorates.find(g => g.code === 'GIZ');

  if (cairoGov) {
    const cairoCenters = [
      { name: { ar: 'مصر الجديدة', en: 'Heliopolis' }, code: 'HLP' },
      { name: { ar: 'المعادي', en: 'Maadi' }, code: 'MAD' },
      { name: { ar: 'مدينة نصر', en: 'Nasr City' }, code: 'NSC' },
      { name: { ar: 'الزمالك', en: 'Zamalek' }, code: 'ZMK' },
      { name: { ar: 'وسط البلد', en: 'Downtown' }, code: 'DTN' }
    ];

    for (const centerData of cairoCenters) {
      await prisma.centers.upsert({
        where: { code: centerData.code },
        update: {},
        create: {
          name: centerData.name,
          code: centerData.code,
          governorateId: cairoGov.id
        }
      });
    }
  }

  if (gizaGov) {
    const gizaCenters = [
      { name: { ar: 'الدقي', en: 'Dokki' }, code: 'DOK' },
      { name: { ar: 'المهندسين', en: 'Mohandessin' }, code: 'MHN' },
      { name: { ar: 'الهرم', en: 'Haram' }, code: 'HRM' },
      { name: { ar: '6 أكتوبر', en: '6th of October' }, code: '6OC' }
    ];

    for (const centerData of gizaCenters) {
      await prisma.centers.upsert({
        where: { code: centerData.code },
        update: {},
        create: {
          name: centerData.name,
          code: centerData.code,
          governorateId: gizaGov.id
        }
      });
    }
  }

  console.log('✅ Centers seeded for Cairo and Giza');

  // Create brand
  const brand = await prisma.brand.upsert({
    where: { slug: 'soleva' },
    update: {},
    create: {
      name: { ar: 'سوليفا', en: 'Soleva' },
      description: { ar: 'علامة تجارية فاخرة للأحذية', en: 'Luxury footwear brand' },
      slug: 'soleva',
      metaTitle: { ar: 'سوليفا - أحذية فاخرة', en: 'Soleva - Luxury Footwear' },
      metaDescription: { ar: 'اكتشف مجموعة سوليفا الفاخرة من الأحذية عالية الجودة', en: 'Discover Soleva\'s luxury collection of premium footwear' }
    }
  });

  console.log('✅ Brand created:', brand.name);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'mens-shoes' },
      update: {},
      create: {
        name: { ar: 'أحذية رجالي', en: 'Men\'s Shoes' },
        description: { ar: 'مجموعة أنيقة من الأحذية الرجالية', en: 'Elegant collection of men\'s footwear' },
        slug: 'mens-shoes',
        metaTitle: { ar: 'أحذية رجالي - سوليفا', en: 'Men\'s Shoes - Soleva' }
      }
    }),
    prisma.category.upsert({
      where: { slug: 'womens-shoes' },
      update: {},
      create: {
        name: { ar: 'أحذية نسائي', en: 'Women\'s Shoes' },
        description: { ar: 'مجموعة عصرية من الأحذية النسائية', en: 'Modern collection of women\'s footwear' },
        slug: 'womens-shoes',
        metaTitle: { ar: 'أحذية نسائي - سوليفا', en: 'Women\'s Shoes - Soleva' }
      }
    })
  ]);

  console.log('✅ Categories created:', categories.length);

  // Create collection
  const collection = await prisma.collection.upsert({
    where: { slug: 'essentials' },
    update: {},
    create: {
      name: { ar: 'سوليفا أساسي', en: 'Soleva Essentials' },
      description: { ar: 'المجموعة الأساسية بأسعار معقولة', en: 'Essential collection with affordable prices' },
      slug: 'essentials',
      isFeatured: true,
      metaTitle: { ar: 'سوليفا أساسي - مجموعة اقتصادية', en: 'Soleva Essentials - Budget Collection' }
    }
  });

  console.log('✅ Collection created:', collection.name);

  // Create sample products
  const products = [
    {
      name: { ar: 'سوليفا كلاسيك رجالي', en: 'Soleva Classic Men' },
      description: { ar: 'حذاء رجالي كلاسيكي بتصميم أنيق وخامات فاخرة مناسب للمناسبات الرسمية والعمل', en: 'Classic men\'s shoe with elegant design and premium materials, perfect for formal occasions and work' },
      slug: 'soleva-classic-men',
      sku: 'SOL-CM-001',
      basePrice: 3900,
      salePrice: 3500,
      images: [
        'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      status: 'ACTIVE',
      isFeatured: true,
      stockQuantity: 50,
      categoryId: categories[0].id, // Men's shoes
      brandId: brand.id,
      collectionId: collection.id,
      specifications: [
        { key: { ar: 'الخامة', en: 'Material' }, value: { ar: 'جلد طبيعي', en: 'Genuine Leather' } },
        { key: { ar: 'النعل', en: 'Sole' }, value: { ar: 'مطاط فاخر', en: 'Premium Rubber' } },
        { key: { ar: 'البطانة', en: 'Lining' }, value: { ar: 'قطن طبيعي', en: 'Natural Cotton' } }
      ],
      variants: [
        { color: { ar: 'أسود', en: 'Black', code: '#191919' }, size: '40', stockQuantity: 10 },
        { color: { ar: 'أسود', en: 'Black', code: '#191919' }, size: '41', stockQuantity: 12 },
        { color: { ar: 'أسود', en: 'Black', code: '#191919' }, size: '42', stockQuantity: 15 },
        { color: { ar: 'بني', en: 'Brown', code: '#8B4513' }, size: '40', stockQuantity: 8 },
        { color: { ar: 'بني', en: 'Brown', code: '#8B4513' }, size: '41', stockQuantity: 10 },
        { color: { ar: 'بني', en: 'Brown', code: '#8B4513' }, size: '42', stockQuantity: 12 }
      ]
    },
    {
      name: { ar: 'سوليفا أنيق نسائي', en: 'Soleva Elegance Women' },
      description: { ar: 'حذاء نسائي أنيق مثالي للمناسبات الخاصة والسهرات مع كعب متوسط مريح', en: 'Elegant women\'s shoe perfect for special occasions and evening events with comfortable medium heel' },
      slug: 'soleva-elegance-women',
      sku: 'SOL-EW-001',
      basePrice: 3500,
      images: [
        'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      status: 'ACTIVE',
      isFeatured: true,
      stockQuantity: 40,
      categoryId: categories[1].id, // Women's shoes
      brandId: brand.id,
      collectionId: null,
      specifications: [
        { key: { ar: 'الخامة', en: 'Material' }, value: { ar: 'جلد ناعم', en: 'Soft Leather' } },
        { key: { ar: 'الكعب', en: 'Heel' }, value: { ar: 'متوسط 5 سم', en: 'Medium 5cm' } },
        { key: { ar: 'البطانة', en: 'Lining' }, value: { ar: 'مبطنة للراحة', en: 'Cushioned for comfort' } }
      ],
      variants: [
        { color: { ar: 'أحمر', en: 'Red', code: '#DC143C' }, size: '36', stockQuantity: 8 },
        { color: { ar: 'أحمر', en: 'Red', code: '#DC143C' }, size: '37', stockQuantity: 10 },
        { color: { ar: 'أحمر', en: 'Red', code: '#DC143C' }, size: '38', stockQuantity: 12 },
        { color: { ar: 'أسود', en: 'Black', code: '#191919' }, size: '36', stockQuantity: 6 },
        { color: { ar: 'أسود', en: 'Black', code: '#191919' }, size: '37', stockQuantity: 8 },
        { color: { ar: 'أسود', en: 'Black', code: '#191919' }, size: '38', stockQuantity: 10 }
      ]
    },
    {
      name: { ar: 'سوليفا أساسي كلاسيك', en: 'Soleva Essential Classic' },
      description: { ar: 'حذاء أساسي بسعر اقتصادي وجودة ممتازة مناسب للاستخدام اليومي', en: 'Essential shoe with budget-friendly price and excellent quality, perfect for daily wear' },
      slug: 'soleva-essential-classic',
      sku: 'SOL-EC-001',
      basePrice: 1800,
      images: [
        'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      status: 'ACTIVE',
      stockQuantity: 60,
      brandId: brand.id,
      collectionId: collection.id,
      specifications: [
        { key: { ar: 'الخامة', en: 'Material' }, value: { ar: 'جلد صناعي', en: 'Synthetic Leather' } },
        { key: { ar: 'النعل', en: 'Sole' }, value: { ar: 'مطاط', en: 'Rubber' } },
        { key: { ar: 'الاستخدام', en: 'Usage' }, value: { ar: 'يومي', en: 'Daily' } }
      ],
      variants: [
        { color: { ar: 'أسود', en: 'Black', code: '#191919' }, size: '38', stockQuantity: 10 },
        { color: { ar: 'أسود', en: 'Black', code: '#191919' }, size: '39', stockQuantity: 12 },
        { color: { ar: 'أسود', en: 'Black', code: '#191919' }, size: '40', stockQuantity: 15 },
        { color: { ar: 'أبيض', en: 'White', code: '#f9f9f9' }, size: '38', stockQuantity: 8 },
        { color: { ar: 'أبيض', en: 'White', code: '#f9f9f9' }, size: '39', stockQuantity: 10 },
        { color: { ar: 'أبيض', en: 'White', code: '#f9f9f9' }, size: '40', stockQuantity: 12 }
      ]
    }
  ];

  for (const productData of products) {
    await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        slug: productData.slug,
        sku: productData.sku,
        basePrice: productData.basePrice,
        salePrice: productData.salePrice || null,
        images: productData.images,
        status: productData.status as any,
        isFeatured: productData.isFeatured || false,
        stockQuantity: productData.stockQuantity,
        categoryId: productData.categoryId || null,
        brandId: productData.brandId || null,
        collectionId: productData.collectionId || null,
        metaTitle: {
          ar: `${productData.name.ar} - سوليفا`,
          en: `${productData.name.en} - Soleva`
        },
        metaDescription: productData.description,
        specifications: {
          create: productData.specifications.map((spec, index) => ({
            key: spec.key,
            value: spec.value,
            sortOrder: index
          }))
        },
        variants: {
          create: productData.variants.map(variant => ({
            color: variant.color,
            size: variant.size,
            stockQuantity: variant.stockQuantity,
            sku: `${productData.sku}-${variant.color.en.toUpperCase()}-${variant.size}`,
            priceDelta: 0
          }))
        }
      }
    });

    console.log('✅ Product created:', productData.name.en);
  }

  // Create sample coupons
  const coupons = [
    {
      code: 'SOLEVA10',
      name: { ar: 'خصم 10%', en: '10% Off' },
      description: { ar: 'خصم 10% على جميع المنتجات', en: '10% discount on all products' },
      type: 'PERCENTAGE',
      value: 10,
      maxDiscount: 300,
      minOrderValue: 200,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      usageLimit: 100
    },
    {
      code: 'FREESHIP',
      name: { ar: 'شحن مجاني', en: 'Free Shipping' },
      description: { ar: 'شحن مجاني لأي طلب', en: 'Free shipping on any order' },
      type: 'FREE_SHIPPING',
      value: 0,
      freeShipping: true,
      validFrom: new Date(),
      usageLimit: 1000
    }
  ];

  for (const couponData of coupons) {
    await prisma.coupon.upsert({
      where: { code: couponData.code },
      update: {},
      create: couponData as any
    });
  }

  console.log('✅ Coupons created:', coupons.length);

  // Create CMS blocks
  const cmsBlocks = [
    {
      key: 'hero_section',
      name: { ar: 'قسم البطل', en: 'Hero Section' },
      content: {
        title: { ar: 'مرحباً بك في سوليفا', en: 'Welcome to Soleva' },
        subtitle: { ar: 'اكتشف مجموعة أحذية فاخرة بتصميم عصري وجودة لا مثيل لها', en: 'Discover premium footwear with modern design and unmatched quality' },
        buttonText: { ar: 'تسوق الآن', en: 'Shop Now' },
        buttonLink: '/products',
        backgroundImage: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'
      }
    },
    {
      key: 'about_section',
      name: { ar: 'قسم من نحن', en: 'About Section' },
      content: {
        title: { ar: 'قصة سوليفا', en: 'Soleva Story' },
        content: {
          ar: 'سوليفا هي علامة تجارية مصرية فاخرة متخصصة في صناعة الأحذية عالية الجودة. نحن نؤمن بأن الأحذية الجيدة تصنع الفرق في حياة الإنسان.',
          en: 'Soleva is a luxury Egyptian brand specializing in high-quality footwear manufacturing. We believe that good shoes make a difference in people\'s lives.'
        }
      }
    }
  ];

  for (const blockData of cmsBlocks) {
    await prisma.cmsBlock.upsert({
      where: { key: blockData.key },
      update: {},
      create: blockData as any
    });
  }

  console.log('✅ CMS blocks created:', cmsBlocks.length);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
