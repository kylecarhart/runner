<script>
  import Header from "../lib/components/common/Header.svelte";
  import Footer from "../lib/components/common/Footer.svelte";
  import "../app.css";
</script>

<div class="grid min-h-screen grid-rows-[min-content_1fr_min-content]">
  <Header />
  <main class="xl:my-8">
    <slot />
  </main>
  <Footer />
</div>
