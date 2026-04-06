import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search as SearchIcon, Package, Briefcase, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SearchResultsPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";
  
  let products: any[] = [];
  let projects: any[] = [];

  if (query) {
    [products, projects] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { category: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 20
      }),
      prisma.project.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
            { surface: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 10
      })
    ]);
  }

  const totalResults = products.length + projects.length;

  return (
    <div className="pt-12 bg-ag-bg min-h-screen pb-32">
      <div className="container-retail">
        <div className="mb-12">
          <span className="text-ag-primary font-extrabold text-[11px] uppercase tracking-widest">Search Inventory</span>
          <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-ag-text uppercase tracking-tight leading-none mt-2">
            Results for &quot;<span className="text-ag-primary">{query}</span>&quot;
          </h1>
          <p className="font-body text-ag-text-muted mt-4">
            Found {totalResults} matches in our products and projects catalog.
          </p>
        </div>

        {!totalResults ? (
          <div className="retail-card p-16 text-center space-y-4">
             <div className="w-16 h-16 bg-ag-bg-alt rounded-full flex items-center justify-center text-ag-text-muted mx-auto">
                <SearchIcon size={32} />
             </div>
             <h2 className="text-xl font-bold text-ag-text">No results found</h2>
             <p className="text-ag-text-muted max-w-sm mx-auto">We couldn&apos;t find anything matching your search. Please try different keywords or browse our categories.</p>
             <Link href="/" className="btn btn-primary inline-flex mt-4">BACK TO HOME</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Products Column */}
            <div className="lg:col-span-8 space-y-6">
               <h3 className="flex items-center gap-2 font-heading font-black text-xs uppercase tracking-[0.2em] text-ag-text-muted mb-4">
                  <Package size={14} className="text-ag-primary" /> Products ({products.length})
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {products.map(p => (
                   <Link key={p.id} href={`/products/${p.slug || p.id}`} className="retail-card group p-4 flex flex-col gap-4 hover:border-ag-primary/30 transition-all">
                      <div className="aspect-square relative overflow-hidden rounded-xl bg-ag-bg-alt border border-ag-border">
                        {p.imagesJson && JSON.parse(p.imagesJson)[0] && (
                          <img src={JSON.parse(p.imagesJson)[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-ag-primary">{p.category}</span>
                        <h4 className="font-body font-extrabold text-ag-text group-hover:text-ag-primary transition-colors mt-0.5">{p.name}</h4>
                        <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-ag-text-muted">
                           <span>View Details</span>
                           <ChevronRight size={14} />
                        </div>
                      </div>
                   </Link>
                 ))}
               </div>
            </div>

            {/* Projects Column */}
            <div className="lg:col-span-4 space-y-6">
               <h3 className="flex items-center gap-2 font-heading font-black text-xs uppercase tracking-[0.2em] text-ag-text-muted mb-4">
                  <Briefcase size={14} className="text-ag-gold" /> Projects ({projects.length})
               </h3>
               <div className="space-y-4">
                 {projects.map(pj => (
                   <Link key={pj.id} href="/projects" className="retail-card block p-5 group hover:border-ag-gold/30 transition-all">
                      <div className="flex items-center justify-between">
                         <div>
                            <p className="text-[10px] font-black uppercase text-ag-gold tracking-widest mb-0.5">{pj.surface}</p>
                            <h4 className="font-body font-bold text-ag-text text-sm group-hover:text-ag-gold transition-colors">{pj.name}</h4>
                            <p className="text-xs text-ag-text-muted mt-1">{pj.city}, {pj.state}</p>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-ag-bg-alt flex items-center justify-center text-ag-text-muted group-hover:bg-ag-gold group-hover:text-white transition-all">
                            <ChevronRight size={16} />
                         </div>
                      </div>
                   </Link>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
