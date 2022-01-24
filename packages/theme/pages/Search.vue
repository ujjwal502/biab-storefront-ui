<template>
  <div class="search-page">
    <ModalCategory v-if="openCategoryModel" @close="onApplyFilter">
      <div slot="body">
        <div>
          <div class="model-category-headers">Category :</div>
          <div class="model-category-headers-div">
            <input
              type="radio"
              id="groceries"
              name="category"
              value="groceries"
              @click="setCategoryValue"
            />
            <label for="groceries" class="model-category-childs"
              >Groceries</label
            ><br />
          </div>
          <div class="model-category-headers-div">
            <input
              type="radio"
              id="electronics"
              name="category"
              value="electronics"
              @click="setCategoryValue"
            />
            <label for="electronics" class="model-category-childs"
              >Electronics & Electrical Gadgets</label
            ><br />
          </div>
          <div class="model-category-headers-div">
            <input
              type="radio"
              id="food"
              name="category"
              value="food"
              @click="setCategoryValue"
            />
            <label for="food" class="model-category-childs"
              >Food & Beverages</label
            ><br />
          </div>
          <div class="model-category-headers-div">
            <input
              type="radio"
              id="lifestyle"
              name="category"
              value="lifestyle"
              @click="setCategoryValue"
            />
            <label for="lifestyle" class="model-category-childs"
              >Lifestyle & Beauty Products</label
            ><br />
          </div>
          <div class="model-category-headers-div">
            <input
              type="radio"
              id="pantry"
              name="category"
              value="pantry"
              @click="setCategoryValue"
            />
            <label for="pantry" class="model-category-childs">Pantry</label
            ><br />
          </div>
        </div>
        <div class="m-10">
          <div class="model-category-headers">Fullfilment Type :</div>
          <div class="model-category-headers-div">
            <input
              type="radio"
              id="home"
              name="fullfilment"
              value="home"
              @click="setFullfilmentValue"
            />
            <label for="home" class="model-category-childs">Home Delivery</label
            ><br />
          </div>
          <div class="model-category-headers-div">
            <input
              type="radio"
              id="pickup"
              name="fullfilment"
              value="pickup"
              @click="setFullfilmentValue"
            />
            <label for="pickup" class="model-category-childs">Pickup</label
            ><br />
          </div>
        </div>
        <div class="m-10">
          <div class="model-category-headers">Payment Type :</div>
          <div class="model-category-headers-div">
            <input
              type="radio"
              id="cod"
              name="payment"
              value="cod"
              @click="setPaymentTypeValue"
            />
            <label for="cod" class="model-category-childs"
              >Cash On Delivery (C.O.D)</label
            ><br />
          </div>
          <div class="model-category-headers-div">
            <input
              type="radio"
              id="upi"
              name="payment"
              value="upi"
              @click="setPaymentTypeValue"
            />
            <label for="upi" class="model-category-childs">UPI</label><br />
          </div>
          <div class="model-category-headers-div">
            <input
              type="radio"
              id="card"
              name="payment"
              value="card"
              @click="setPaymentTypeValue"
            />
            <label for="card" class="model-category-childs">Credit Card</label
            ><br />
          </div>
        </div>
      </div>
    </ModalCategory>
    <div class="search-bar side-padding searchBy-search-bar">
      <SfSearchBar
        :placeholder="searchByPlaceholderMapper[selectedSearchByOption]"
        aria-label="Search"
        :icon="null"
        :value="searchKey"
        @input="(value) => (searchKey = value)"
        @keydown.enter="searchHit($event)"
        :disabled="!selectedLocation.latitude || !selectedLocation.longitude"
      >
        <template #icon>
          <div
            :class="{
              'dropdown-button': true,
              'dropdown-disabled':
                !selectedLocation.latitude || !selectedLocation.longitude
            }"
            @click="onDropdownHeaderClick"
          >
            <div v-if="selectedSearchByOption === 'search-by-all'">All</div>
            <SfImage
              v-else
              :src="`/icons/${selectedSearchByOption}.png`"
              :alt="`${selectedSearchByOption}`"
            />
            <SfIcon icon="chevron_down" size="xxs" />
          </div>
          <div>
            <SfButton
              v-if="searchKey"
              class="sf-search-bar__button sf-button--pure"
              @click="clearSearch"
            >
              <span class="sf-search-bar__icon sf-icon-adjust">
                <SfIcon color="var(--c-text)" size="20px" icon="cross" />
              </span>
            </SfButton>

            <SfButton
              v-else
              class="sf-search-bar__button sf-button--pure"
              @click="
                isSearchOpen ? (isSearchOpen = false) : (isSearchOpen = true)
              "
            >
              <span class="sf-search-bar__icon sf-icon-adjust">
                <SfIcon size="xxs" icon="search" />
              </span>
            </SfButton>
          </div>

          <div>
            <SfButton
              class="sf-search-bar__button sf-button--pure sf-button-width"
              @click="onFilterHandle"
            >
              <span class="sf-icon-filter">
                <SfIcon size="md" icon="filter2" />
              </span>
            </SfButton>
          </div>
        </template>
      </SfSearchBar>
      <div class="dowpdown" v-if="openSearchByDropdown">
        <div
          class="dowpdown-item"
          v-for="(searchBy, key, index) in searchByMapper"
          :key="key"
          @click="onSelectDropdownItem(key)"
          :class="{ border: index !== Object.keys(searchByMapper) - 1 }"
        >
          <SfImage
            :src="`/icons/${key}.png`"
            :alt="`${key}`"
            class="search-by-icon"
          />
          {{ searchBy }}
        </div>
      </div>
    </div>

    <div class="details">
      <transition-group name="sf-fade" mode="out-in" v-if="!enableLoader">
        <div
          v-if="pollResults && pollResults.length > 0"
          class="search__wrapper-results"
          key="results"
        >
          <div class="side-padding result-num">
            <div>
              <span
                ><span v-e2e="'total-result'">{{ totalResults }}</span> results
                found</span
              >
            </div>
            <div class="price-sort-toggler" @click="openSortByDropdown">
              <!-- TO DO :- complete this icon after having a discussion with the designer -->
              <svg
                width="10"
                height="18"
                viewBox="0 0 10 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.04677 14.6065L4.04826 17.6058C4.10874 17.6663 4.17594 17.7222 4.24538 17.7693C4.25658 17.776 4.26777 17.7827 4.27897 17.7894C4.31033 17.8096 4.34169 17.8298 4.37305 17.8454C4.41113 17.8656 4.45145 17.8835 4.48953 17.9014C4.49401 17.9014 4.49849 17.9037 4.50297 17.9059C4.54105 17.9194 4.57912 17.9328 4.61496 17.944C4.65752 17.9574 4.70008 17.9664 4.74264 17.9754C4.82551 17.991 4.91287 18 4.99799 18C5.1279 18 5.25558 17.9821 5.38102 17.944C5.41909 17.9328 5.45717 17.9194 5.49301 17.9059C5.49749 17.9037 5.50197 17.9014 5.50645 17.9014C5.54677 17.8835 5.58485 17.8656 5.62293 17.8454C5.65429 17.8298 5.68564 17.8118 5.717 17.7894C5.79764 17.7402 5.87604 17.6797 5.94772 17.6058H5.94996L8.94921 14.6065C9.47559 14.0801 9.47559 13.229 8.94921 12.7048C8.42507 12.1807 7.5739 12.1807 7.04976 12.7048L6.34194 13.4126V1.34395C6.34194 0.602539 5.74164 0 4.99799 0C4.25658 0 3.65404 0.602539 3.65404 1.34395V13.4104L2.94846 12.7048C2.42208 12.1807 1.57315 12.1807 1.04677 12.7048C0.522629 13.229 0.522629 14.0801 1.04677 14.6065Z"
                  fill="#F37A20"
                />
              </svg>
            </div>

            <div class="sort-dowpdown" v-if="showSortByDropdown">
              <div
                class="sort-dowpdown-item"
                v-for="(sortBy, key, index) in sortByMapper"
                :key="key"
                @click="onSelectSortDropdownItem(key)"
                :class="{ border: index !== Object.keys(searchByMapper) - 1 }"
              >
                {{ sortBy }}
              </div>
            </div>
          </div>
          <div v-for="(bpp, bppIndex) in pollResults" :key="bppIndex">
            <div
              v-for="(provider, prIndex) in bpp.bpp_providers"
              :key="prIndex"
            >
              <div
                v-for="(product, pIndex) in sortItemsByPrice(provider.items)"
                :key="
                  bppIndex +
                    '-' +
                    prIndex +
                    '-' +
                    pIndex +
                    '-' +
                    keyVal +
                    'product'
                "
                class="results--mobile"
              >
                <ProductCard
                  @goToProduct="goToProduct(product, provider, bpp)"
                  :pName="productGetters.getName(product)"
                  :pProviderName="providerGetters.getProviderName(provider)"
                  :pPrice="productGetters.getPrice(product).regular"
                  :pImage="productGetters.getGallery(product)[0].small[0]"
                  :pDistance="'800m away'"
                  :pWieght="productGetters.getProductWeight(product) + ' kg'"
                  :pCount="cartGetters.getItemQty(isInCart({ product }))"
                  @updateItemCount="
                    (item) => updateItemCount(item, provider, bpp, pIndex)
                  "
                  :horizontalView="false"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="noSearchFound" key="no-search" class="before-results">
          <SfImage
            src="/icons/feather_search.svg"
            class=""
            alt="error"
            loading="lazy"
          />
          <p>
            <b>{{ $t('Your search did not yield ') }}</b>
          </p>
          <p>
            <b>{{ $t('any results ') }}</b>
          </p>
          <p>{{ $t('Please try searching again using ') }}</p>
          <p>{{ $t('different keyword') }}</p>
        </div>
      </transition-group>

      <LoadingCircle :enable="enableLoader" key="loding-cir" />
    </div>
    <div v-if="cartGetters.getTotalItems(cart)" class="sr-footer">
      <Footer
        @buttonClick="footerClick"
        :totalPrice="cartGetters.getTotals(cart).total"
        :totalItem="cartGetters.getTotalItems(cart)"
        buttonText="View Cart"
      >
        <template v-slot:buttonIcon>
          <SfIcon icon="empty_cart" color="white" :coverage="1" />
        </template>
      </Footer>
    </div>
  </div>
</template>

<script>
import { SfIcon, SfSearchBar, SfButton, SfImage } from '@storefront-ui/vue';
import { ref, onBeforeMount, watch, computed } from '@vue/composition-api';
import LoadingCircle from '~/components/LoadingCircle';
import ProductCard from '~/components/ProductCard';
import Footer from '~/components/Footer';
import { useUiState } from '~/composables';
import debounce from 'lodash.debounce';
import ModalCategory from '~/components/ModelCategory';
import {
  productGetters,
  providerGetters,
  cartGetters,
  useCart,
  useFacet,
  useSearch
} from '@vue-storefront/beckn';

export default {
  name: 'Search',
  components: {
    LoadingCircle,
    SfIcon,
    SfSearchBar,
    SfButton,
    ProductCard,
    Footer,
    SfImage,
    ModalCategory
  },
  setup(_, context) {
    const {
      searchString,
      changeSearchString,
      selectedLocation,
      toggleLoadindBar,
      clearCartPopup
    } = useUiState();
    const goBack = () => {
      context.root.$router.back();
    };

    const { addItem, cart, isInCart, load } = useCart();
    const data = context.root.$route.params.searchKey;
    const searchKey = ref(data);
    const isSortAscending = ref(null);
    const enableLoader = ref(Boolean(data));
    const keyVal = ref(0);
    const { search, result } = useFacet();
    const { pollResults, poll, polling, stopPolling } = useSearch('search');
    const noSearchFound = ref(false);
    const openCategoryModel = ref(false);
    const categoryValue = ref('');
    const fullfilmentValue = ref('');
    const paymentTypeValue = ref('');
    const openSearchByDropdown = ref(false);
    const showSortByDropdown = ref(false);
    const selectedSearchByOption = ref(
      context.root.$route.params.searchBy || 'search-by-all'
    );
    const searchByMapper = {
      'search-by-all': 'All',
      'search-by-seller': 'Search by Seller',
      'search-by-category': 'Search by Category'
    };
    const searchByPlaceholderMapper = {
      'search-by-all': 'Search for Items',
      'search-by-seller': "Enter Seller's Name",
      'search-by-category': 'Enter Category Name'
    };

    const sortByMapper = {
      'sort-items-by-popularity': 'Popularity',
      'sort-ttems-by-price': 'Price',
      'sort-items-by-relevance': 'Relevance',
      'sort-items-by-distance': 'Distance'
    };

    console.log(cart);

    watch(
      () => clearCartPopup.value,
      (newVal) => {
        if (!newVal) {
          keyVal.value++;
        }
      }
    );

    const handleSearch = debounce((paramValue) => {
      if (polling.value) stopPolling();
      enableLoader.value = true;
      if (noSearchFound.value) noSearchFound.value = false;
      toggleLoadindBar(false);

      search({
        term: paramValue,
        locationIs:
          selectedLocation?.value?.latitude +
          ',' +
          selectedLocation?.value?.longitude,
        searchBy: selectedSearchByOption.value
        // eslint-disable-next-line no-unused-vars
      }).then((_) => {
        localStorage.setItem(
          'transactionId',
          result.value.data.ackResponse.context.transaction_id
        );

        poll({
          // eslint-disable-next-line camelcase
          message_id: result.value.data.ackResponse.context.message_id
        });
      });

      console.log('result value', pollResults.value);
    }, 1000);

    watch(
      () => pollResults.value,
      (newValue) => {
        if (newValue?.length > 0 && enableLoader.value) {
          enableLoader.value = false;
          toggleLoadindBar(true);
        }
      }
    );

    watch(
      () => polling.value,
      (newValue) => {
        if (!newValue) {
          enableLoader.value = false;
          toggleLoadindBar(false);
          if (pollResults?.value.length === 0) {
            noSearchFound.value = true;
          }
        } else {
          enableLoader.value = true;
          noSearchFound.value = false;
        }
      }
    );

    onBeforeMount(async () => {
      await load();
      if (searchKey.value) {
        handleSearch(searchKey.value);
      }
    });

    const searchHit = (value) => {
      if (value?.target?.value) {
        if (value.target.value === searchString.value) {
          handleSearch(value.target.value);
        } else {
          changeSearchString(value.target.value);
          console.log(searchString.value);
        }
      }
    };

    watch(searchString, (newVal) => {
      if (newVal !== '') {
        searchKey.value = newVal;
        handleSearch(newVal);
      }
    });

    const onSearchChange = (value) => {
      searchKey.value = value;
      console.log(searchKey.value);
    };

    const clearSearch = () => {
      searchKey.value = '';
    };

    const totalResults = computed(() => {
      let reusltNum = 0;
      for (const bpp of pollResults?.value) {
        if (bpp.bpp_providers.length !== 0) {
          for (const provider of bpp.bpp_providers) {
            if (provider.items) {
              reusltNum += provider.items.length;
            }
          }
        }
      }
      return reusltNum;
    });

    const sortByPriceToggler = () => {
      isSortAscending.value = !isSortAscending.value;
    };

    const sortItemsByPrice = (items) => {
      if (isSortAscending.value === null) {
        return items;
      }
      if (isSortAscending.value === true) {
        const ascendingSortedArray = items.sort(
          (a, b) => a?.price?.value - b?.price?.value
        );
        return ascendingSortedArray;
      }

      const descendingSortedArray = items.sort(
        (a, b) => b?.price?.value - a?.price?.value
      );
      return descendingSortedArray;
    };

    const footerClick = () => {
      context.root.$router.push('/cart');
    };

    const goToProduct = (product, provider, bpp) => {
      const data = btoa(
        JSON.stringify({
          product,
          bpp: {
            id: bpp.bpp_id,
            descriptor: bpp.bpp_descriptor
          },
          bppProvider: {
            id: provider.id,
            descriptor: provider.descriptor
          },
          locations: provider.locations
        })
      );
      context.root.$router.push({
        path: '/product',
        query: {
          data: data
        }
      });
    };

    const updateItemCount = (data, provider, bpp, index) => {
      addItem({
        product: provider.items[index],
        quantity: data,
        customQuery: {
          bpp: {
            id: bpp.bpp_id,
            descriptor: bpp.bpp_descriptor
          },
          bppProvider: {
            id: provider.id,
            descriptor: provider.descriptor
          },
          locations: provider.locations
        }
      });
    };

    const onDropdownHeaderClick = () => {
      if (selectedLocation.value.latitude || selectedLocation.value.longitude) {
        openSearchByDropdown.value = !openSearchByDropdown.value;
      }
    };

    const onSelectDropdownItem = (selectedOption) => {
      selectedSearchByOption.value = selectedOption;
      openSearchByDropdown.value = false;
    };

    const onFilterHandle = () => {
      openCategoryModel.value = !openCategoryModel.value;
      console.log(openCategoryModel.value);
    };

    const setCategoryValue = (event) => {
      console.log('Categairy Value: ', event.target.value);
      categoryValue.value = event.target.value;
    };

    const setFullfilmentValue = (event) => {
      console.log('Fullfilment Value: ', event.target.value);
      fullfilmentValue.value = event.target.value;
    };

    const setPaymentTypeValue = (event) => {
      console.log('Payment Value: ', event.target.value);
      paymentTypeValue.value = event.target.value;
    };

    const onApplyFilter = () => {
      openCategoryModel.value = !openCategoryModel.value;
      return openCategoryModel;
    };

    const openSortByDropdown = () => {
      showSortByDropdown.value = !showSortByDropdown.value;
    };

    const onSelectSortDropdownItem = (key) => {
      console.log('Key Value: ', key);
      showSortByDropdown.value = !showSortByDropdown.value;
    };
    return {
      goBack,
      enableLoader,
      productGetters,
      providerGetters,
      cartGetters,
      searchKey,
      keyVal,
      openCategoryModel,
      showSortByDropdown,
      noSearchFound,
      cart,
      pollResults,
      isInCart,
      onSearchChange,
      clearSearch,
      updateItemCount,
      handleSearch,
      searchHit,
      footerClick,
      totalResults,
      goToProduct,
      sortByMapper,
      sortByPriceToggler,
      sortItemsByPrice,
      isSortAscending,
      selectedSearchByOption,
      openSearchByDropdown,
      selectedLocation,
      onDropdownHeaderClick,
      onSelectDropdownItem,
      searchByMapper,
      searchByPlaceholderMapper,
      onFilterHandle,
      setCategoryValue,
      setPaymentTypeValue,
      setFullfilmentValue,
      onApplyFilter,
      openSortByDropdown,
      onSelectSortDropdownItem
    };
  }
};
</script>

<style lang="scss" scoped>
.price-sort-toggler {
  padding-right: 9px;
  cursor: pointer;
}
.side-padding {
  display: flex;
  justify-content: space-between;
}

.dropdown-button {
  position: absolute;
  border-right: 1px solid #d9d9d9;
  height: 100%;
  padding: 10px;
  width: 75px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #f37a20;
  box-sizing: border-box;
  font-weight: 700;
  cursor: pointer;
}

.dowpdown {
  background: #ffffff;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 0 7px;
  position: absolute;
  top: 75px;
  width: 342px;
  z-index: 1;
  .dowpdown-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    cursor: pointer;
  }
  .border {
    border-bottom: 1px solid rgba(226, 226, 226, 0.7);
  }
  .color-text {
    color: #f37a20;
    cursor: pointer;
  }
}

.sort-dowpdown {
  background: #ffffff;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 0 7px;
  position: absolute;
  top: 210px;
  width: 130px;
  left: 240px;
  z-index: 1;
  .sort-dowpdown-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    cursor: pointer;
  }
  .border {
    border-bottom: 1px solid rgba(226, 226, 226, 0.7);
  }
  .color-text {
    color: #f37a20;
    cursor: pointer;
  }
}

.search-by-icon {
  padding-right: 20px;
  padding-left: 8px;
}

.dropdown-disabled {
  opacity: 0.4;
  color: #e0e0e1 !important;

  .sf-icon {
    --icon-color: #e0e0e1 !important;
  }
}
.sf-icon-filter {
  .sf-icon {
    --icon-size: 28px !important;
  }
}

.sf-icon-adjust {
  margin-right: 30px !important;
}

// .sf-button-width{
//   --icon-width: 30px !important
// }

.search-bar {
  position: relative;
}

.radio-button {
  border: 1px solid #000000;
}

// input[type='radio']:after {
//   background-color: #ffa500;
// }
[type='radio']:checked:after {
  background-color: #ffa500;
}

.model-category-headers {
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  padding-bottom: 10px;
  color: #37474f;
}

.model-category-headers-div {
  display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
}

.model-category-childs {
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  margin-left: 8px;
}
.m-10 {
  margin-top: 15px;
}
</style>
