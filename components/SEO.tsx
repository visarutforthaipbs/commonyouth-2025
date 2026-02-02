import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  name = 'Commons Youth Platform', 
  type = 'website',
  image = '/image/share-image.jpg', // Default share image
  url 
}) => {
  const siteTitle = 'Commons Youth Platform | พื้นที่พลังเยาวชน';
  const defaultDescription = 'แพลตฟอร์มเชื่อมต่อกลุ่มเยาวชน ค้นหากิจกรรม และแสดงพลังของคนรุ่นใหม่ทั่วประเทศไทย';
  
  const metaTitle = title ? `${title} | ${name}` : siteTitle;
  const metaDescription = description || defaultDescription;
  const metaImage = image; // Should be absolute URL in production
  const metaUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{metaTitle}</title>
      <meta name='description' content={metaDescription} />

      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={name} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
}

export default SEO;
