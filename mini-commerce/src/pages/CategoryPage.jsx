import React from 'react'
import { useParams } from 'react-router-dom'
import SEO from '../components/SEO'

const CategoryPage = () => {
  const { category } = useParams()
  const title = category ? `${category} | Minka Luxury Hair` : 'Categories | Minka Luxury Hair'
  const description = category
    ? `Shop ${category} hair products — wigs, extensions and more from Minka Luxury Hair.`
    : `Explore categories at Minka Luxury Hair — premium wigs, extensions, closures and frontals.`

  return (
    <div>
      <SEO title={title} description={description} url={`https://minkaluxury.com/category/${category || ''}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">{category ? category : 'All Categories'}</h1>
        <p className="text-gray-600">Category listing will render here.</p>
      </div>
    </div>
  )
}

export default CategoryPage
