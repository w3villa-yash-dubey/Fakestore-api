// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (productId) {
  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      const container = document.getElementById("productDetail");
      container.innerHTML = `
        <h2>${product.title}</h2>
        <img src="${product.image}" alt="${product.title}" width="200" />
        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Description:</strong> ${product.description}</p>
      `;
    });
} else {
  document.getElementById("productDetail").textContent = "Product not found.";
}
