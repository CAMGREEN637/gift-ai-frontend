// app/content/articles.ts

export interface Gift {
  name: string;
  price: string;
  reason: string;
  url: string;
  image_url: string;
}

export interface ArticleSection {
  type: 'picks' | 'cta' | 'text';
  gifts?: Gift[];
  heading?: string;
  body?: string;
}

export interface GiftArticle {
  slug: string;
  title: string;
  excerpt: string;
  occasion: string;
  interests: string[];
  readTime: string;
  publishedAt: string;
  sections: ArticleSection[];
  relatedArticles?: string[];
}

export const SAMPLE_ARTICLES: GiftArticle[] = [
  // ============================================================================
  // BIRTHDAY GIFTS — COFFEE LOVERS
  // ============================================================================
  {
    slug: "birthday-gifts-coffee",
    title: "Birthday Gift Ideas for a Coffee-Obsessed Girlfriend",
    excerpt: "Birthday gifts matched to her love of coffee, ranked by how thoughtful they'll feel.",
    occasion: "birthday",
    interests: ["coffee"],
    readTime: "4 min read",
    publishedAt: "2026-05-01",
    relatedArticles: [
      "birthday-gifts-cooking",
      "birthday-gifts-reading",
      "valentines-gifts-coffee",
      "christmas-gifts-coffee"
    ],
    sections: [
      {
        type: "text",
        heading: "What most guys get wrong about coffee gifts",
        body: "Buying a birthday gift for someone who's into coffee sounds straightforward — but the wrong pick can feel generic or lazy. The best gifts in this space connect to how she actually engages with coffee, not just the category label."
      },
      {
        type: "text",
        heading: "Making it land",
        body: "Birthday gifts hit different when they feel considered, not last-minute. If it arrives in Amazon packaging, rewrap it. A handwritten note — even two sentences — elevates any gift."
      },
      {
        type: "picks",
        gifts: [
          {
            name: "20 Bar Semi-Automatic Espresso Machine",
            price: "$159.00",
            reason: "This espresso machine demonstrates your attention to detail and appreciation for quality, which aligns with making her birthday special. It's a thoughtful gift that allows your girlfriend to enjoy a luxurious coffee experience at home.",
            url: "https://www.amazon.com/HIBREW-H10B-Temperature-Adjustable-Intelligent/dp/B0DLP26373?crid=3LJEBJLSS58L5&dib=eyJ2IjoiMSJ9.VRfsNFwOnWd_4xvdvi1vQ1gnO7pp1TWyTMz6hYXrp60IW99Li0B_EQsDKi6gRXiZQrIA0E11VP2Dm-6o-YbwmGxkUEo1fLmqNWPxAfbyB5IW8ot43CDr1w2z5sKE_5TX2ZqkuONNNF6c3Ieq-7xkwxMQGnIBkftJu95YFz4N6rg4VqHrAe3_a6lqqLQE_bFMJLF87_Dgn94NvgdKBBH_ZzayyjUBmuznEsZqCjpDwrNV9IV-U4OYUhAxbMSmlTgFsCXAcm_Xsl41OaM0H22F3LsnhlZhVChJ0UsJBN6ArqA.sMMG9Sm2lc7yL4Jy2y5sZy-3uO9KwKpka23MhvJK6Hc&dib_tag=se&keywords=Breville%2BBarista%2BExpress%2BEspresso%2BMachine&qid=1773107129&sprefix=breville%2Bbarista%2Bexpress%2Bespresso%2Bmachine%2Caps%2C341&sr=8-3-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=59d8a555daf224f89b05d4dd502510ff&language=en_US&ref_=as_li_ss_tl",
            image_url: "https://m.media-amazon.com/images/I/71CeX2VA0+L._AC_SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "World Coffee Discovery Set - 8-Pack",
            price: "$59.00",
            reason: "A coffee sampler like this shows you've put thought into offering your girlfriend a fun and cozy experience on her birthday. It's a unique way to celebrate her and let her explore different flavors as part of her special day.",
            url: "https://www.amazon.com/dp/B09GZSQMRJ",
            image_url: "https://m.media-amazon.com/images/I/51BxEaYF-+L._SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "Espresso Martini Kit",
            price: "$45.00",
            reason: "This espresso martini kit captures the celebratory vibe of her birthday and shows you want her to enjoy something fun. It's a fun gift for your girlfriend that highlights her desire for good times while celebrating her special day.",
            url: "https://www.amazon.com/Espresso-Martini-Gifts-Complete-Botanicals/dp/B0FW25RLC5?crid=3CJNI70R46CHZ&dib=eyJ2IjoiMSJ9.ZR2nqrEwJgautpxRgRVWeBXqIDGF35iKcFIe8ps-OIqC5DjqQ_syS_0n9ykyK1m1LAgGAcX5sehf0nFxmnWzlZOyD8a56oRuOfJ-5QqJCAkS_WVpPBmE5_AHs4HGAHkRcuJ7WdH4r3HQyeTpaf95XAdqYJrtJrUrvG3MmL9xL4e0gcR7GogSAZXlKjFV2JLwmp9sGxZeBakXSY_VL74X2Rqy_6I69QocjB3XorwfIIHkwPFs2C8SVJqyLv6uWLXcOFHSCSAXcA-RQTOpPkOp8WS8XS3CKaRp7GkheA5od0A.auAsuxsXHw3sqm0qR1WwSFCuhwhswIIQxjdsbU1X_YA&dib_tag=se&keywords=Espresso+martini+kit&qid=1776008712&sprefix=espresso+martini+kit%2Caps%2C1175&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=41f4e893f1df165f058706118238ca93&language=en_US&ref_=as_li_ss_tl",
            image_url: "https://m.media-amazon.com/images/I/71W-IVXYZ9L._AC_SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "6-Cup Pour-Over Glass Coffeemaker",
            price: "$47.00",
            reason: "The Chemex Pour-Over Coffeemaker offers a cozy, thoughtful way for your girlfriend to enjoy her coffee experience, making it an ideal birthday gift. It's a beautiful and functional piece that reflects your care for her preferences.",
            url: "https://www.amazon.com/dp/B0000YWF5E",
            image_url: "https://m.media-amazon.com/images/I/71oMA36JxfL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "Fellow Stagg EKG Pro Kettle",
            price: "$179.00",
            reason: "Investing in a high-quality kettle like this showcases your attention to detail and luxury for your girlfriend's birthday celebration. It's a thoughtful gesture that enhances her coffee-making experience.",
            url: "https://www.amazon.com/Fellow-Stagg-Electric-Gooseneck-Kettle/dp/B0BF7DXLBF?crid=3OIMZOVWJNRXA&dib=eyJ2IjoiMSJ9.kgh-95Gmn8iXvGBVrnDCwGYdH7kyBSsJUYSbIVGugVCU7ykZcZ0-q8ZTxnprn2nesd4fsNV_4UiRsDLDcPu1nuvbXkS6XfxBYeCJWnCySX3ROQ16gqFvjhH6z7ILy9uNJneHAeZ-EURmTnfhcBHi1agw-0Yowqwh1-gaAd0hUiyGkRSlcokxhkMaszS00Se5RyIJox-GUC59jO6qfVHrdOmh4SPeFJEquaVa5fpgE.kK2UVqiZS6OHuJWy5OJI_lb5cQkTDQcuLCR7_NuLs&dib_tag=se&keywords=Fellow%2BStagg%2BEKG%2BElectric%2BPour-Over%2BKettle&qid=1776730622&s=handmade&sprefix=fellow%2Bstagg%2Bekg%2Belectric%2Bpour-over%2Bkettle%2Cspecialty-aps%2C433&sr=8-1&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=e5edc9a0e8e188c4b4cf4ce4ea95024b&language=en_US&ref_=as_li_ss_tl",
            image_url: "https://m.media-amazon.com/images/I/61grHEIj7PL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          }
        ]
      },
      {
        type: "cta"
      }
    ]
  }

{
  "slug": "mothers_day-gifts-skincare",
  "title": "5 Thoughtful Mother’s Day Skincare Gifts That Don’t Feel Generic",
  "excerpt": "Curated mothers_day gift ideas for a girlfriend who's into skincare — each one with an explanation of why it works.",
  "occasion": "mothers_day",
  "interests": [
    "skincare"
  ],
  "readTime": "4 min read",
  "publishedAt": "2026-05-02",
  "sections": [
    {
      "type": "picks",
      "gifts": [
        {
          "name": "Rodan + Fields Luxury Skincare Set",
          "price": "$199.20",
          "reason": "This skincare kit allows your wife to indulge in a luxurious self-care routine, providing her with the pampering she deserves on Mother's Day. It shows that you recognize her hard work and want her to take a well-deserved break to focus on herself.",
          "url": "https://www.amazon.com/Rodan-Fields-Redefine-Appearance-Firmness/dp/B01LHPRZFE?adgrpid=1334807680377124&dib=eyJ2IjoiMSJ9.vNwidWy7M36jyNXaqISGFCAA51DkL_HiYuR0DXwKnm5vaoT0eyRIpzDLSdazGcRUFF6jga01jsw3NPhGK0lNffG2zejIRbqnvCUAeqmvWrvrwX3cK9cgdJuii4yqubzeQ0_lfHkK7hzRwElUO_GyoBIpfpshBtY-mB2HSKiFAOTsTVVmNkHQWOUSHAygADnQhfswlLQbw1BXdg-LvbC2DBTricf9C0332DdgaxY3ot3CFwh9QlE1GxYqg-GSP1PDonuoIkDdIpMTYDpoy2LhYOqboXi84U1APuWkY308-WE.JNohrTUUe29SoEN-2OCs3OaFp7V6ne2WVGp3nR-qrlc&dib_tag=se&hvadid=83425866964659&hvbmt=bp&hvdev=c&hvlocphy=79130&hvnetw=o&hvqmt=p&hvtargid=kwd-83425824611205%3Aloc-190&hydadcr=27529_14788860&keywords=best+skin+care+sets+for+women&mcid=0c5c65dda7e73fc2b5c355be760b48e0&msclkid=a841f6e682371a4418259f2ed52d6840&qid=1774737186&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=284fc3f2aee9fe1a6876a53489609c75&language=en_US&ref_=as_li_ss_tl",
          "image_url": "https://m.media-amazon.com/images/I/51AHekjUOkL._SL1500_.jpg"
        },
        {
          "name": "4D Red Light Therapy Face Mask",
          "price": "$179.00",
          "reason": "This red light therapy mask is a perfect way for your wife to relax and rejuvenate her skin, allowing her to indulge in some personal time. It's a thoughtful gesture that acknowledges her need for self-care and appreciation on this special day.",
          "url": "https://www.amazon.com/dp/B0FJS8ZQWS?maas=maas_adg_api_591804581339319208_static_9_129&aa_campaignid=lv_4b9e4NCSPDPodUvBVE&aa_adgroupid=lv_GkCHmtolszTKUOCWcB&aa_creativeid=lv_GaHtQ89nbgwHXkQWzr&m=A2F97CWV4SAWYO&linkCode=ll2&tag=cbggiftapp637-20&linkId=f6f921d72446bb436ddc452c78b448ec&language=en_US&ref_=as_li_ss_tl",
          "image_url": "https://m.media-amazon.com/images/I/41AUc0hbRmL._SY300_SX300_QL70_FMwebp_.jpg"
        },
        {
          "name": "Lavender Spa Gift Set for Women",
          "price": "$139.00",
          "reason": "This luxurious spa gift set offers your wife a complete pampering experience right at home, aligning perfectly with the Mother's Day spirit of relaxation and care. It reflects your understanding of her need to unwind and indulge in self-care.",
          "url": "https://www.amazon.com/Lizush-Piece-Complete-Luxury-Women/dp/B088ZHBX22?crid=2G4FUVG6DASK1&dib=eyJ2IjoiMSJ9.wdNCtqyWta1khiiItcCLEpIhdm4EINKvTl_DHBm_SnxBItbZaoZk8OIAHJOgJeB2W27kbbkpT2Z4y7Q_qi86DdzHjJ2gJ3-LV6SD9fHaMaz6e7q8mYW6kcc2Td3rZPx0a2u3ZieMlP2ksPmue-3agNO0-fBLYTqdqh4Cc7uxCG1k3CioUQMTnwfqx_dex9LRESDR5LuFEMhJE4s42bhaGmA-9Nql839dB1g6sXWY6Vfdl8chIfjD07-4GPGC17PFGzEqICnmafZ2Un2XwJfY4vaAlV7ND2sYHeU9x5NI0jc.JU4TOnIMdhDBIDGIRql33BPX2JOLX5EP0WzFzfpUQJs&dib_tag=se&keywords=Luxury%2BBath%2BSpa%2BGift%2BBasket&qid=1773537574&sprefix=luxury%2Bbath%2Bspa%2Bgift%2Bbasket%2Caps%2C879&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=9adbe727004cb2e61534ae42ad47e515&language=en_US&ref_=as_li_ss_tl",
          "image_url": "https://m.media-amazon.com/images/I/513jKGDIIYL._SY300_SX300_QL70_FMwebp_.jpg"
        },
        {
          "name": "ELEMIS SPF 30 Daily Facial Moisturizer",
          "price": "$119.00",
          "reason": "This facial moisturizer provides your wife with a daily luxury that celebrates her beauty while helping her feel rejuvenated. It's a lovely way to show her that you value the time and effort she puts into looking after herself.",
          "url": "https://www.amazon.com/ELEMIS-Pro-Collagen-Marine-Cream-SPF/dp/B07BMBQG73?content-id=amzn1.sym.582a5b7f-e458-4b67-81d0-f4623d03d4db%3Aamzn1.sym.582a5b7f-e458-4b67-81d0-f4623d03d4db&crid=3VN2E0TD1YFX8&cv_ct_cx=sunblock&keywords=sunblock&pd_rd_i=B07BMBQG73&pd_rd_r=a7114abf-2f7d-4f53-ba7c-8a90d9d18ab9&pd_rd_w=V1e4H&pd_rd_wg=n0vET&pf_rd_p=582a5b7f-e458-4b67-81d0-f4623d03d4db&pf_rd_r=495FY18MF9JN2J8HCD6E&qid=1776907518&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sprefix=sunblock%2Caps%2C222&sr=1-3-905f6665-3817-4290-88eb-a2363c78a4a1-spons&aref=4IXxEF4y02&sp_csd=d2lkZ2V0TmFtZT1zcF9zZWFyY2hfdGhlbWF0aWM&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=e10101586eeab8e737c00e52dbdf074e&language=en_US&ref_=as_li_ss_tl",
          "image_url": "https://m.media-amazon.com/images/I/61EU70GZWTL._SL1500_.jpg"
        },
        {
          "name": "Skincare Fridge with LED Mirror",
          "price": "$135.59",
          "reason": "This thoughtful skincare fridge allows your wife to keep her beauty products organized and at the perfect temperature, enhancing her self-care routine. It shows that you understand and support her desire to treat herself well.",
          "url": "https://www.amazon.com/Kikihouse-Skincare-Lighting-Dimmable-Cosmetic/dp/B0GSZN88J7?crid=27258EJ1UFEKA&dib=eyJ2IjoiMSJ9.zx3Fk_WUmRwXrzp0D0gU5e8TQm6CEfK107oHJZIR6M7gEgWXcZaRUbcX3i1rblMyXdfNjFGHb-4M9J-txRLwc1vdOSyce7LMxYMUBkkjNharuM0WeaajbCOq5XJpb73WBcfcFFecYCu--UvWlQGP5v5DBTCnIGwx-e2_W2DN8bP1lHgeCbsuhPtbTLujDkzTGnuTospC_bpyg60rBUT60zgYZtwzAz0fcueKfEBmEyo.OogYByPYITc49JWl2R2F2NbgmFzK2Ke5CFJQGVLnKpc&dib_tag=se&keywords=skincare%2Bfridge&qid=1774738658&sprefix=skinca%2Caps%2C210&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=d59697ac6fb7f43bcf3f5073fd57af0c&language=en_US&ref_=as_li_ss_tl",
          "image_url": "https://m.media-amazon.com/images/I/61IdGY1rcPL._AC_SL1500_.jpg"
        }
      ]
    },
    {
      "type": "cta"
    },
    {
      "type": "text",
      "heading": "Why skincare gifts need extra thought",
      "body": "Buying a mothers_day gift for someone who's into skincare sounds straightforward — but the wrong pick can feel generic or lazy. The best gifts in this space connect to how she actually engages with skincare, not just the category label."
    },
    {
      "type": "text",
      "heading": "Making it land",
      "body": "Mother's Day gifts land best when paired with an experience — breakfast in bed, a quiet morning, or just handling everything for the day so she doesn't have to."
    },
    {
      "type": "cta"
    }
  ]
}

  // Add more articles here as you build them
  // TEMPLATE:
  // {
  //   slug: "occasion-gifts-interest",
  //   title: "Title Here",
  //   excerpt: "Short summary",
  //   occasion: "birthday|valentines|anniversary|christmas|mothers_day|just_because|apology",
  //   interests: ["interest_name"],
  //   readTime: "4 min read",
  //   publishedAt: "2026-05-01",
  //   relatedArticles: ["slug1", "slug2"],
  //   sections: [...]
  // }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getArticleBySlug(slug: string): GiftArticle | undefined {
  return SAMPLE_ARTICLES.find(article => article.slug === slug);
}

export function getArticlesByOccasion(occasion: string): GiftArticle[] {
  return SAMPLE_ARTICLES.filter(article => article.occasion === occasion);
}

export function getArticlesByInterest(interest: string): GiftArticle[] {
  return SAMPLE_ARTICLES.filter(article => article.interests.includes(interest));
}

export function getArticlesByOccasionAndInterest(
  occasion: string,
  interest: string
): GiftArticle[] {
  return SAMPLE_ARTICLES.filter(
    article => article.occasion === occasion && article.interests.includes(interest)
  );
}

export function getAllArticles(): GiftArticle[] {
  return SAMPLE_ARTICLES;
}

export function getRelatedArticles(article: GiftArticle): GiftArticle[] {
  if (!article.relatedArticles) return [];
  return article.relatedArticles
    .map(slug => getArticleBySlug(slug))
    .filter(Boolean) as GiftArticle[];
}
