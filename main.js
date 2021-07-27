const eventBus = new Vue();

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
    <div class="product">
        <div class="product-image">
          <a class="product-anchor" :href="image">
            <img :src="image" />
          </a>
        </div>

        <div class="product-info">
          <h1>{{ title }}</h1>
          <p v-if="inStock">In Stock</p>
          <p v-else :class="{ lineThrough: !inStock}">Out of stock</p>
          <span>{{sale}}</span>

          <product-details-tabs :details="details" :shipping="shipping"></product-details-tabs>

          <div
            v-for="(variant, index) in variants"
            :key="variant.variantId"
            class="color-box"
            :style="{ backgroundColor: variant.variantColor }"
            @mouseover="updateProduct(index)"
          ></div>

          <button
            @click="addToCart"
            :disabled="!inStock"
            :class="{ disabledButton: !inStock}"
          >
            Add to Cart
          </button>
          <button
            @click="removeFromCart"
            :class="{ disabledButton: !inStock}"
          >
            Remove
          </button>

        </div>

        <product-tabs :reviews="reviews"></product-tabs> 

      </div>
  `,
  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      selectedVariant: 0,
      onSale: true,
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      variants: [
        {
          variantId: 2234,
          variantColor: 'green',
          variantImage:
            'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
          variantQuantity: 10,
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage:
            'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
          variantQuantity: 2,
        },
      ],
      reviews: [],
    };
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.id);
    },
    removeFromCart() {
      this.$emit('remove-from-cart', this.id);
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
  },
  computed: {
    // computed methods are cached unless one of their dependencies change
    title() {
      return `${this.brand} ${this.product}`;
    },
    id() {
      return this.variants[this.selectedVariant].variantId;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      return this.onSale ? `${this.brand} ${this.product} are on sale!` : '';
    },
    shipping() {
      return this.premium ? 'Free' : 2.99;
    },
  },
  mounted() {
    eventBus.$on('review-submitted', (productReview) => {
      this.reviews.push(productReview);
    });
  },
});

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `,
});

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if='errors.length'>
        <strong>Please correct the following error(s):</strong>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>


      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>

      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
        </select>
      </p>

      <p>Would you recommend this product?</p>
      <label>
        Yes
        <input type="radio" value="Yes" v-model="recommend" />   
      </label>
      <label>
        No
        <input type="radio" value="No" v-model="recommend"/>
      </label>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        const productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend,
        };

        eventBus.$emit('review-submitted', productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        const newErrors = [];

        if (!this.name) newErrors.push('Name required.');
        if (!this.review) newErrors.push('Review required.');
        if (!this.rating) newErrors.push('Rating required.');
        if (!this.recommend) newErrors.push('Recommendation required.');

        this.errors = newErrors;
      }
    },
  },
});

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  template: `
    <div>
      <span class="tab" 
            :class="{ activeTab: selectedTab === tab }"
            v-for="(tab, index) in tabs" 
            :key="index" 
            @click="selectedTab = tab">
            {{ tab }}</span>

      <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
          </li>
        </ul>
      </div>

      <product-review v-show="selectedTab === 'Make a Review'"></product-review>
    </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews',
    };
  },
});

Vue.component('product-details-tabs', {
  props: {
    shipping: {
      type: String,
      required: true,
    },
    details: {
      type: Array,
      required: true,
    },
  },
  template: `
    <div>
      <span class="tab" 
            :class="{ activeTab: selectedTab === tab }"
            v-for="(tab, index) in tabs" 
            :key="index" 
            @click="selectedTab = tab">
            {{ tab }}</span>

      <p v-show="selectedTab === 'Shipping'">{{ shipping }}</p>
      <product-details v-show="selectedTab === 'Product Details'" :details="details"></product-details>
    </div>
  `,
  data() {
    return {
      tabs: ['Shipping', 'Product Details'],
      selectedTab: 'Shipping',
    };
  },
});

const app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeItem(id) {
      const itemIndex = this.cart.indexOf(id);
      if (itemIndex !== -1) {
        this.cart.splice(index, 1);
      }
    },
  },
});
