const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find existing products
    const allProducts = await Product.find().select('slug name');
    console.log('\nExisting products:');
    allProducts.forEach(p => console.log(`  - ${p.name} (${p.slug})`));
    
    // Test slug generation
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const createUniqueSlug = async (name, excludeId = null) => {
      const baseSlug = name
        .toString()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      let query = { slug: baseSlug };
      if (excludeId) {
        query._id = { $ne: excludeId };
      }

      const existingProduct = await Product.findOne(query);
      if (!existingProduct) {
        console.log('✓ Base slug available:', baseSlug);
        return baseSlug;
      }

      console.log('✗ Base slug exists, finding variants...');
      const slugPattern = new RegExp(`^${escapeRegExp(baseSlug)}(?:-(\\d+))?$`, 'i');
      const allMatches = await Product.find({ slug: slugPattern }).select('slug');
      
      console.log('  Matching slugs:', allMatches.map(p => p.slug));
      
      const suffixes = allMatches
        .map((product) => {
          const match = product.slug.toLowerCase().match(new RegExp(`^${escapeRegExp(baseSlug)}(?:-(\\d+))?$`));
          if (match && match[1]) {
            return parseInt(match[1], 10);
          }
          return 0;
        });

      console.log('  Suffixes found:', suffixes);
      const nextSuffix = Math.max(...suffixes) + 1;
      return `${baseSlug}-${nextSuffix}`;
    };
    
    const newSlug = await createUniqueSlug('Virgin Brazilian Hair');
    console.log('\nGenerated slug for "Virgin Brazilian Hair":', newSlug);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
