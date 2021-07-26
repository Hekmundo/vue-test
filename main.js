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
          <p>Shipping: {{ shipping }}</p>

          <productDetails :details="details"></productDetails>

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
            :disabled="cart < 1"
            :class="{ disabledButton: !inStock}"
          >
            Remove
          </button>

        </div>
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
});

Vue.component('productDetails', {
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
      const index = this.cart.indexOf(id);
      if (index !== -1) {
        this.cart.splice(index, 1);
      }
    },
  },
});
