async function test() {
  try {
    const res = await fetch('http://127.0.0.1:3001/api/products');
    const data = await res.json();
    console.log('API Status:', res.status);
    console.log('Product Count:', data.products?.length);
  } catch (e) {
    console.error('API Error:', e.message);
  }
}
test();
