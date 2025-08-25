"use server";

import puppeteer from 'puppeteer';

const TITLE_SELECTOR = 'div > div > div > div > div > section > div > div._t0tx82 > div > h1';
const PRICE_SELECTOR = 'div > div > div > div > div > div > div > div._wgmchy > div._1k1ce2w > div > div > span > div > span._11jcbg2';
const PROPERTY_TYPE_SELECTOR =
  'div > div > div > section > div.toieuka.atm_c8_2x1prs.atm_g3_1jbyh58.atm_fr_11a07z3.atm_cs_10d11i2.atm_c8_sz6sci__oggzyc.atm_g3_17zsb9a__oggzyc.atm_fr_kzfbxz__oggzyc.dir.dir-ltr > h2';
const ROOM_INFO_SELECTOR =
  'div > div > div > section > div.o1kjrihn.atm_c8_km0zk7.atm_g3_18khvle.atm_fr_1m9t47k.atm_h3_1y44olf.atm_c8_2x1prs__oggzyc.atm_g3_1jbyh58__oggzyc.atm_fr_11a07z3__oggzyc.dir.dir-ltr > ol > li';
const PERK_LIST_SELECTOR = 'section > div.i1jq8c6w.atm_9s_1txwivl.atm_ar_1bp4okc.atm_cx_1tcgj5g_95nicl.dir.dir-ltr > div';
const DESCRIPTION_SELECTOR = 'div.d1isfkwk.atm_vv_1jtmq4.atm_w4_1hnarqo.dir.dir-ltr > div > span > span';
const SHOW_ALL_AMENITIES_SELECTOR = 'section > div.b9672i7.atm_h3_8tjzot.atm_h3_1ph3nq8__oggzyc.dir.dir-ltr > button';
const AMENITIES_LIST_SELECTOR =
  'div > div > section > div > div > div.p1psejvv.atm_9s_1bgihbq.dir.dir-ltr > div > div._17itzz4 > div > div > div > section > section > div';
const RATING_SELECTOR =
  'div > div > div > a > div > div.a8jhwcl.atm_c8_vvn7el.atm_g3_k2d186.atm_fr_1vi102y.atm_9s_1txwivl.atm_ar_1bp4okc.atm_h_1h6ojuz.atm_cx_t94yts.atm_le_14y27yu.atm_c8_sz6sci__14195v1.atm_g3_17zsb9a__14195v1.atm_fr_kzfbxz__14195v1.atm_cx_1l7b3ar__14195v1.atm_le_1l7b3ar__14195v1.dir.dir-ltr > div:nth-child(2)';
const REVIEW_COUNT_SELECTOR =
  'div > div > div > a > div > div.rddb4xa.atm_9s_1txwivl.atm_ar_1bp4okc.atm_h_1h6ojuz.atm_cx_t94yts.atm_le_yh40bf.atm_le_idpfg4__14195v1.atm_cx_idpfg4__14195v1.dir.dir-ltr > div.r16onr0j.atm_c8_vvn7el.atm_g3_k2d186.atm_fr_1vi102y.atm_gq_myb0kj.atm_vv_qvpr2i.atm_c8_sz6sci__14195v1.atm_g3_17zsb9a__14195v1.atm_fr_kzfbxz__14195v1.atm_gq_idpfg4__14195v1.dir.dir-ltr';
// const MIN_STAY_SELECTOR = 'div > div > div > div > div > section > div > div._t0tx82 > div > h3';
const REVIEW_LIST_SELECTOR = 'div > section > div._88xxct > div > div > div._b7zir4z';
const CLEAN_FEE_SELECTOR = 'div > div > div > div > div > div > div > div._1cvivhm > div > section > div._1n7cvm7 > div._14omvfj';
const SHOW_PHOTOS_SELECTOR = 'div > div > div > div > div > div._z80d2i > div > div._ekor09 > button';
const IMG_CAPTION_SELECTOR = 'div._1hwkgn6 > ul._7h1p0g';
const EXIT_IMG_SELECTOR =
  'div > div > section > div > div > div.p1psejvv.atm_9s_1bgihbq.dir.dir-ltr > div > section > div > div > div > div > section > div > div > div.p1psejvv.atm_9s_1bgihbq.dir.dir-ltr > div > div._xgxxi4 > div._1kpxj8f > button';

const TRANSLATION_POPUP_CLOSE_SELECTOR =
  'div > div > section > div > div > div.p1psejvv.atm_9s_1bgihbq.dir.dir-ltr > div > div.c1lbtiq8.atm_mk_stnw88.atm_9s_1txwivl.atm_fq_1tcgj5g.atm_wq_kb7nvz.atm_tk_1tcgj5g.dir.dir-ltr > button';

async function delay(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

export async function scrapeAirbnbListing(url: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Waiting For Full Page To Load ...');
  await page.goto(url);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  try {
    // Check if the popup close button exists
    const popupCloseButton = await page.$(TRANSLATION_POPUP_CLOSE_SELECTOR);
    if (popupCloseButton) {
      console.log('Popup detected. Closing it...');
      await popupCloseButton.click(); // Click the close button
      await delay(1000);
    } else {
      console.log('No popup detected. Proceeding...');
    }
  } catch (err) {
    console.log('Error handling popup: ', err);
  }

  try {
    console.log('Getting Basic Data');
    console.log('Checking for translation popup...');

    // Title
    const titleHandle = await page.$(TITLE_SELECTOR);
    const title = titleHandle != null ? await page.evaluate((el) => el.innerText, titleHandle) : null;

    // Nightly Rate
    const priceHandle = await page.$(PRICE_SELECTOR);
    const nightlyRate = priceHandle != null ? await page.evaluate((el) => el.innerText, priceHandle) : null;

    // const minimumStayHandle = await page.$(MIN_STAY_SELECTOR);
    // const minmumStay = minimumStayHandle != null ? await page.evaluate((el) => el.innerText, minimumStayHandle) : null;
    // const minimumStay = 1;

    // Cleaning Fee
    let cleaningFee = null;
    const charges = await page.$$(CLEAN_FEE_SELECTOR);

    for (const feeHandle of charges) {
      const feeName = await page.evaluate((el) => el.children[0].textContent, feeHandle);
      const fee = await page.evaluate((el) => el.children[1].textContent, feeHandle);

      if (feeName?.search('Cleaning fee') != -1) {
        cleaningFee = fee;
      }
    }

    // Property Type & Location
    const propertyTypeHandle = await page.$(PROPERTY_TYPE_SELECTOR);
    const propertyInfo = await page.evaluate((el) => el?.innerText, propertyTypeHandle);
    const propertyType = propertyInfo?.split(' in ')[0];
    const location = propertyInfo?.split(' in ')[1];

    // Room Info (Guests, Bedrooms, Beds, Baths, etc)
    const propertyInfoListHandle = await page.$$(ROOM_INFO_SELECTOR);
    let guestCapacity = null;
    // let bedrooms = null;
    // let beds = null;
    // let bath = null;

    for (const propertyInfoHandle of propertyInfoListHandle) {
      const infoPoint = await page.evaluate((el) => el.innerText, propertyInfoHandle);

      if (infoPoint.search('guest') != -1) {
        guestCapacity = infoPoint;
      } else if (infoPoint.search('bedrooms') != -1) {
        // bedrooms = infoPoint;
      } else if (infoPoint.search('beds') != -1) {
        // beds = infoPoint;
      } else if (infoPoint.search('bath') != -1) {
        // bath = infoPoint;
      }
    }

    // Room Perks
    const perkHandles = await page.$$(PERK_LIST_SELECTOR);
    const roomPerks = [];

    for (const perkHandle of perkHandles) {
      const perkTitle = await page.evaluate((el) => el.querySelector('div._llvyuq')?.textContent, perkHandle);
      const perkBody = await page.evaluate((el) => el.querySelector('div._1hwkgn6')?.textContent, perkHandle);

      roomPerks.push({ perkTitle, perkBody });
    }

    // Rating
    const ratingHandle = await page.$(RATING_SELECTOR);
    const rating = await page.evaluate((el) => el?.innerText, ratingHandle);

    // Review Count
    const reviewCountHandle = await page.$(REVIEW_COUNT_SELECTOR);
    const reviewCount = await page.evaluate((el) => el?.innerText, reviewCountHandle);

    // Highlighted Reviews
    const reviewHandles = await page.$$(REVIEW_LIST_SELECTOR);
    const highlightedReviews = [];

    for (const reviewHandle of reviewHandles) {
      const review = await page.evaluate((el) => {
        return el.querySelector('span.l1h825yc.atm_kd_19r6f69_24z95b.atm_kd_19r6f69_1xbvphn_1oszvuo.dir.dir-ltr')?.textContent;
      }, reviewHandle);

      highlightedReviews.push(review);
    }

    console.log('Getting Description...');

    // Description
    const descriptionHandle = await page.$(DESCRIPTION_SELECTOR);
    const description = await page.evaluate((el) => el?.innerText, descriptionHandle);

    console.log('Getting Images...');

    // Photos
    await page.click(SHOW_PHOTOS_SELECTOR);
    await page.waitForNetworkIdle();

    let photoCount = await page.evaluate(() => document.querySelectorAll('div._cdo1mj').length);

    let captionHandles = await page.$$(IMG_CAPTION_SELECTOR);
    let captions = [];

    for (const captionHandle of captionHandles) {
      const caption = await page.evaluate((el) => el.innerText, captionHandle);
      captions.push(caption);
    }

    // Attempt to exit image view
    try {
      await page.click(EXIT_IMG_SELECTOR);
      await delay(1000);
      console.log('Closed Image Section');
    } catch {
      console.log('Image selector failed. Retrying...');
      // Reload page and reattempt
      await page.goto(url);
      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      // Handle translation popup if it reappears
      const TRANSLATION_POPUP_CLOSE_SELECTOR = 'span[data-button-content="true"]';
      const popupCloseButton = await page.$(TRANSLATION_POPUP_CLOSE_SELECTOR);
      if (popupCloseButton) {
        console.log('Translation popup detected again. Closing it...');
        await popupCloseButton.click();
        await delay(1000);
      }

      console.log('Retrying image selector...');
      await page.click(SHOW_PHOTOS_SELECTOR);
      await page.waitForNetworkIdle();

      photoCount = await page.evaluate(() => document.querySelectorAll('div._cdo1mj').length);

      captionHandles = await page.$$(IMG_CAPTION_SELECTOR);
      captions = [];

      for (const captionHandle of captionHandles) {
        const caption = await page.evaluate((el) => el.innerText, captionHandle);
        captions.push(caption);
      }
    }

    await delay(1500);

    console.log('Getting Amenities...');

    // Amenities
    await page.click(SHOW_ALL_AMENITIES_SELECTOR);
    await page.waitForSelector(AMENITIES_LIST_SELECTOR, { visible: true });

    const amenitySectionHandles = await page.$$(AMENITIES_LIST_SELECTOR);
    const amenityList = [];
    const missingAmenities = [];

    for (const amenitySectionHandle of amenitySectionHandles) {
      const amenityType = await page.evaluate((el) => {
        return el.querySelector('div._14li9j3g > h2')?.textContent;
      }, amenitySectionHandle);

      const amenities = await page.evaluate((el) => {
        const listItems = el.querySelectorAll('ul._2f5j8p > li');
        const amenities = [];

        for (const li of listItems) {
          amenities.push(li.textContent);
        }

        return amenities;
      }, amenitySectionHandle);

      //amenityList.push({ type: amenityType, items: amenities });
      if (amenityType?.search('Not included') == -1) amenityList.push(...amenities);
      else missingAmenities.push(...amenities);
    }

    await browser.close();

    return {
      success: true,
      title,
      description,
      propertyType,
      roomType: '',
      location,
      guestCapacity: guestCapacity != null ? parseInt(guestCapacity.replace('guests', '').replace(' ', '')) : 0,
      pricing: {
        nightlyRate: nightlyRate != null ? parseFloat(nightlyRate.replace('$', '').replace(' ', '').replace(',', '')) : 0,
        cleaningFee: cleaningFee != null ? parseInt(cleaningFee.replace('$', '').replace(',', '')) : '',
        dynamicPricing: null,
        minimumStay: null,
      },
      photos: {
        photoCount: photoCount,
        captions: captions,
      },
      reviews: {
        reviewCount: reviewCount != null ? parseInt(reviewCount) : 0,
        rating: rating != null ? parseFloat(rating) : 0,
        recentReviews: highlightedReviews,
      },
      availability: {
        occupancyRate: '',
        seasonality: '',
      },
      amenities: {
        provided: amenityList,
        missing: missingAmenities,
      },
      seo: {
        keywordsInTitle: [],
        keywordsInDescription: [],
      },
    };
  } catch (err) {
    console.log('Failed To Scrape Page');
    console.error(err);
    return { success: false, error: err };
  }
}
