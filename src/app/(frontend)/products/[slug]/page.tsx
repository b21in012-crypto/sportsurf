import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import FinalCTA from "@/components/sections/FinalCTA";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import ProductGallery from "@/components/sections/ProductGallery";

const DynamicIcon = ({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) => {
   const IconComponent = (LucideIcons as any)[name];
   if (!IconComponent) return <LucideIcons.HelpCircle size={size} className={className} />;
   return <IconComponent size={size} className={className} />;
};

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
   const product: any = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { subCategory: true }
   });

   if (!product) {
      notFound();
   }

   // Parse specs and images if stored as stringified JSON
   let specs: { label: string; value: string }[] = [];
   let images: string[] = [];
   let whyInvest: { icon: string; title: string; desc: string }[] = [];
   let premiumBenefits: string[] = [];
   let services: { icon: string; title: string; desc: string }[] = [];

   try {
      specs = JSON.parse(product.specs || "[]");
   } catch {
      specs = [];
   }

   try {
      images = JSON.parse(product.imagesJson || "[]");
      if (images.length === 0 && product.imageUrl) {
         images = [product.imageUrl];
      }
   } catch {
      images = product.imageUrl ? [product.imageUrl] : [];
   }

   // Fallbacks for Why Invest
   try {
      whyInvest = JSON.parse(product.whyInvestJson || "[]");
      if (whyInvest.length === 0) throw new Error();
   } catch {
      whyInvest = [
         { icon: "TrendingUp", title: "Boost Player Development", desc: "Consistent, high-quality surfaces allow athletes to train better, enhancing their core skills and agility." },
         { icon: "LineChart", title: "Increase Usage & ROI", desc: "All-weather structural engineering ensures your facility can be utilized and rented out year-round." },
         { icon: "PiggyBank", title: "Reduce Maintenance Costs", desc: "Designed strictly for extreme commercial durability with minimal operational upkeep." }
      ];
   }

   // Fallbacks for Premium Benefits
   try {
      premiumBenefits = JSON.parse(product.premiumBenefitsJson || "[]");
      if (premiumBenefits.length === 0) throw new Error();
   } catch {
      premiumBenefits = ['Enhanced structural shock absorption.', 'UV resistance for long-lasting color.', 'Seamless precision installation.', 'Zero-defect guarantee on delivery.'];
   }

   // Fallbacks for Services
   try {
      services = JSON.parse(product.servicesJson || "[]");
      if (services.length === 0) throw new Error();
   } catch {
      services = [
         { icon: "PenTool", title: "Consultation & Design", desc: "Expert 3D site analysis and custom architectural planning tailored to your exact terrain." },
         { icon: "HardHat", title: "Civil & Earthworks", desc: "Complete groundwork preparation, levelling, and implementation of advanced subsurface drainage systems." },
         { icon: "Hammer", title: "Professional Installation", desc: "High-precision surface laying by certified European-trained experts ensuring absolute zero defects." },
         { icon: "FileCheck2", title: "Testing & Certification", desc: "Rigorous post-installation performance and safety testing to guarantee league approvals." }
      ];
   }

   return (
      <div className="bg-ag-bg min-h-screen pt-52 pb-0">

         {/* Breadcrumb */}
         <div className="container-retail mb-8">
            <div className="flex items-center gap-2 text-xs font-body text-ag-text-muted tracking-wider uppercase">
               <Link href="/" className="hover:text-ag-primary transition-colors">Home</Link>
               <LucideIcons.ChevronRight size={12} />
               <Link href="/products" className="hover:text-ag-primary transition-colors">Products</Link>
               <LucideIcons.ChevronRight size={12} />
               <Link href={`/products?category=${product.category}`} className="hover:text-ag-primary transition-colors capitalize">{product.category.replace('-', ' ')}</Link>
               <LucideIcons.ChevronRight size={12} />
               <span className="text-ag-primary font-semibold truncate max-w-[200px]">{product.name}</span>
            </div>
         </div>

         <div className="container-retail mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

               {/* LEFT SIDE: Image Gallery (Client Component) */}
               <ProductGallery 
                  images={images} 
                  productName={product.name} 
               />

               {/* RIGHT SIDE: Product Intro & Quick Actions */}
               <div className="flex flex-col justify-center">
                  <span className="text-sm font-bold text-ag-primary tracking-widest uppercase mb-3 block">
                     {product.category.replace("-", " ")} {product.subCategory?.name ? ` > ${product.subCategory.name}` : ""}
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-5xl font-heading font-black text-ag-text mb-6 leading-[1.1] uppercase tracking-tighter">
                     {product.name}
                  </h1>

                  <p className="text-ag-text-muted text-lg font-body leading-relaxed mb-8 max-w-xl">
                     {product.description} Engineered for professional athletes and commercial facilities requiring ultra-high durability and safety compliance.
                  </p>

                  <div className="flex flex-wrap gap-4 mb-10">
                     <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-ag-border shadow-sm">
                        <LucideIcons.ShieldCheck className="text-ag-primary" size={20} />
                        <span className="text-sm font-bold text-ag-text">10+ Year Warranty</span>
                     </div>
                     <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-ag-border shadow-sm">
                        <LucideIcons.Award className="text-ag-primary" size={20} />
                        <span className="text-sm font-bold text-ag-text">FIFA/FIBA Standards</span>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                     <a href="#services" className="btn btn-primary flex-1 py-4 text-base shadow-xl shadow-ag-primary/20 justify-center">
                        Request Project Estimate <LucideIcons.ArrowRight size={18} className="ml-2" />
                     </a>
                     <button className="btn btn-outline flex-1 py-4 text-base justify-center">
                        Download Brochure
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Why Invest & Dimensions Section */}
         <div className="bg-white border-y border-ag-border/50 py-12">
            <div className="container-retail">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                  {/* Why Invest */}
                  <div className="lg:col-span-7">
                     <h2 className="text-3xl font-heading font-black text-ag-text mb-10 uppercase tracking-tighter">
                        Why Invest in <span className="text-ag-primary">{product.name}</span>
                     </h2>

                     <div className="space-y-8">
                        {whyInvest.map((item, idx) => (
                          <div key={idx} className="flex gap-6 group">
                             <div className="shrink-0 w-16 h-16 rounded-2xl bg-ag-bg-alt border border-ag-border flex items-center justify-center group-hover:bg-ag-primary group-hover:border-ag-primary transition-colors duration-300">
                                <DynamicIcon name={item.icon} className="text-ag-primary group-hover:text-white transition-colors duration-300" size={32} />
                             </div>
                             <div>
                                <h3 className="text-xl font-bold font-heading text-ag-text mb-2">{item.title}</h3>
                                <p className="text-ag-text-muted font-body leading-relaxed">
                                   {item.desc}
                                </p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Dimensions & Specs Grid + Why Premium */}
                  <div className="lg:col-span-5 flex flex-col gap-10">

                     <div className="bg-ag-bg-alt rounded-2xl p-8 border border-ag-border">
                        <h3 className="text-2xl font-heading font-black text-ag-text mb-6 uppercase tracking-tighter flex items-center gap-3">
                           <LucideIcons.Ruler className="text-ag-primary" /> Dimensions & Specs
                        </h3>
                        <div className="space-y-0 border border-ag-border/60 rounded-xl overflow-hidden bg-white">
                           {specs.length > 0 ? specs.map((spec, index) => (
                              <div key={spec.label} className={`flex ${index !== specs.length - 1 ? 'border-b border-ag-border/60' : ''}`}>
                                 <div className="w-2/5 p-4 bg-gray-50/50 font-bold text-sm text-ag-text border-r border-ag-border/60">
                                    {spec.label}
                                 </div>
                                 <div className="w-3/5 p-4 text-sm text-ag-text-muted font-medium">
                                    {spec.value}
                                 </div>
                              </div>
                           )) : (
                              <div className="p-4 text-sm text-ag-text-muted italic">Specs are updated periodically for this model.</div>
                           )}
                        </div>
                     </div>

                     <div>
                        <h3 className="text-xl font-bold font-heading text-ag-text mb-4 uppercase">Why Choose Premium?</h3>
                        <ul className="space-y-3">
                           {premiumBenefits.map((benefit, i) => (
                              <li key={i} className="flex gap-3 items-start">
                                 <LucideIcons.CheckCircle2 className="text-ag-primary shrink-0 mt-0.5" size={18} />
                                 <span className="text-ag-text font-medium text-sm">{benefit}</span>
                               </li>
                           ))}
                        </ul>
                     </div>

                  </div>
               </div>
            </div>
         </div>

         {/* What We Do Section */}
         <div id="services" className="py-12 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/images/turf_texture.png')] opacity-10 mix-blend-overlay"></div>
            <div className="container-retail relative z-10">

               <div className="text-center max-w-3xl mx-auto mb-10">
                  <span className="text-ag-primary font-bold tracking-widest uppercase text-sm mb-4 block">End-to-End Execution</span>
                  <h2 className="text-4xl md:text-5xl font-heading font-black text-ag-text uppercase tracking-tighter">
                     {product.servicesTitle || "Premium Services"}
                  </h2>
                  <p className="mt-4 text-ag-text-muted font-body text-lg">
                     {product.servicesSubtitle || "We take full ownership of your project from the ground up. No third-party contractors, just absolute perfection."}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {services.map((service, idx) => (
                     <div key={idx} className="bg-white p-8 rounded-2xl border border-ag-border hover:border-ag-primary hover:shadow-2xl transition-all duration-300 group">
                        <div className="w-14 h-14 bg-ag-bg-alt rounded-full flex items-center justify-center text-ag-primary mb-6 group-hover:bg-ag-primary group-hover:text-white transition-colors duration-300">
                           <div className="text-ag-primary group-hover:text-white">
                              <DynamicIcon name={service.icon} size={26} />
                           </div>
                        </div>
                        <h3 className="text-xl font-bold font-heading text-ag-text mb-3">{service.title}</h3>
                        <p className="text-ag-text-muted text-sm leading-relaxed">{service.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <FeaturedProjects />
         
         {/* Huge Bold Blue Contact Banner */}
         <div className="mt-0">
            <FinalCTA />
         </div>

      </div>
   );
}
