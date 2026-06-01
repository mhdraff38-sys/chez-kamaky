// ===========================
// DONNÉES PRODUITS
// ===========================
const produits = [
  // VÊTEMENTS
  { id: 1,  nom: "Robe Imprimée Africaine",    cat: "Vêtements",    prix: 12000, img: "Robe imprimée africaine.jpg",      badge: "new"   },
  { id: 2,  nom: "Tenue Casual",               cat: "Vêtements",    prix: 9500,  img: "tenue-casual.jpg",                 badge: null    },
  { id: 3,  nom: "Ensemble Orange Moderne",    cat: "Vêtements",    prix: 18000, img: "Ensemble orange moderne.jpg",       badge: "promo" },
  { id: 4,  nom: "Tenue Chic Camel",           cat: "Vêtements",    prix: 7500,  img: "Tenue chic camel.jpg",             badge: null    },
  { id: 5,  nom: "Robe Longue Plage",          cat: "Vêtements",    prix: 14000, img: "Robe longue plage.jpg",            badge: "new"   },

  // SACS
  { id: 6,  nom: "Collection Sacs Cuir",       cat: "Sacs",         prix: 22000, img: "Collection sacs cuir.jpg",         badge: "new"   },
  { id: 7,  nom: "Sac Bandoulière Croco",      cat: "Sacs",         prix: 15000, img: "Sac bandoulière croco.jpg",        badge: null    },
  { id: 8,  nom: "Tote Bag Cuir Camel",        cat: "Sacs",         prix: 21000, img: "Tote bag cuir camel.jpg",          badge: "promo" },

  // CHAUSSURES
  { id: 9,  nom: "Crocs Confort Blanc",        cat: "Chaussures",   prix: 12000, img: "Crocs confort blanc.jpg",          badge: null    },
  { id: 10, nom: "Sandales Dorées Africaines", cat: "Chaussures",   prix: 11000, img: "Sandales dorées africaines.jpg",   badge: "new"   },
  { id: 11, nom: "Sandales Noires Élégantes",  cat: "Chaussures",   prix: 13500, img: "Sandales noires élégantes.jpg",    badge: null    },

  // ÉLECTRONIQUE
  { id: 12, nom: "Smartphones Android",        cat: "Électronique", prix: 45000, img: "Smartphones Android.jpg",          badge: "new"   },
  { id: 13, nom: "Écouteurs Sans Fil",         cat: "Électronique", prix: 18500, img: "Écouteurs sans fil.jpg",           badge: null    },
  { id: 14, nom: "Pack Smartphones",           cat: "Électronique", prix: 85000, img: "Pack smartphones.jpg",             badge: "promo" },

  // ARTISANAT
  { id: 15, nom: "Bracelet Bois Africain",     cat: "Artisanat",    prix: 4500,  img: "Bracelet bois africain.jpg",       badge: null    },
  { id: 16, nom: "Parure Cauris Africaine",    cat: "Artisanat",    prix: 7500,  img: "Parure cauris africaine.jpg",      badge: "new"   },
  { id: 17, nom: "Médaillon Sculpté Africain", cat: "Artisanat",    prix: 6500,  img: "Médaillon sculpté africain.jpg",   badge: null    },
  { id: 18, nom: "Masque Africain Perles",     cat: "Artisanat",    prix: 9500,  img: "Masque africain perles.jpg",       badge: null    },
  { id: 19, nom: "Masque Africain Traditionnel", cat: "Artisanat",  prix: 8000,  img: "Masque africain traditionnel.jpg", badge: "promo" },
  { id: 20, nom: "Masques Muraux Bois Naturel", cat: "Artisanat",   prix: 15000, img: "Masques muraux bois naturel.jpg",  badge: null    },
];

// ===========================
// ÉTAT
// ===========================
let categorieActive = "Tous";
let panier = JSON.parse(localStorage.getItem("kamaky_panier") || "{}");

function sauvegarderPanier() {
  localStorage.setItem("kamaky_panier", JSON.stringify(panier));
}

// ===========================
// AFFICHAGE PRODUITS
// ===========================
function afficherProduits() {
  const grille = document.getElementById("produits-grid");
  const liste = categorieActive === "Tous"
    ? produits
    : produits.filter(p => p.cat === categorieActive);

  grille.innerHTML = liste.map((p, index) => {
    const dansLePanier = panier[p.id] > 0;
    const badgeHTML = p.badge === "new"
      ? '<span class="produit-badge badge-new">Nouveau</span>'
      : p.badge === "promo"
      ? '<span class="produit-badge badge-promo">Promo</span>'
      : "";

    return `
      <div class="produit-card" style="animation-delay:${index * 0.05}s">
        <div class="produit-img">
          ${badgeHTML}
          <img src="${p.img}" alt="${p.nom}" loading="lazy"
               onerror="this.src='logo-original.png'; this.style.objectFit='contain'; this.style.padding='16px';" />
        </div>
        <div class="produit-body">
          <div class="produit-cat">${p.cat}</div>
          <div class="produit-nom">${p.nom}</div>
          <div class="produit-footer">
            <span class="produit-prix">${p.prix.toLocaleString("fr-FR")} F</span>
            <button class="btn-ajouter ${dansLePanier ? "ajoute" : ""}" onclick="ajouterAuPanier(${p.id})">
              ${dansLePanier ? "Ajouté" : "+ Ajouter"}
            </button>
          </div>
        </div>
      </div>`;
  }).join("");
}

// ===========================
// FILTRES
// ===========================
function initialiserFiltres() {
  const filtres = document.querySelectorAll(".filtre");
  filtres.forEach(btn => {
    btn.addEventListener("click", () => {
      filtres.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      categorieActive = btn.dataset.cat;
      afficherProduits();
    });
  });
}

// ===========================
// PANIER
// ===========================
function ajouterAuPanier(id) {
  panier[id] = (panier[id] || 0) + 1;
  sauvegarderPanier();
  afficherContenuPanier();
  mettreAJourBadge();
  afficherProduits();
  ouvrirPanier();
}

function retirerDuPanier(id) {
  if (panier[id] > 1) {
    panier[id]--;
  } else {
    delete panier[id];
  }
  sauvegarderPanier();
  afficherContenuPanier();
  mettreAJourBadge();
  afficherProduits();
}

function augmenterQte(id) {
  panier[id] = (panier[id] || 0) + 1;
  sauvegarderPanier();
  afficherContenuPanier();
  mettreAJourBadge();
}

function mettreAJourBadge() {
  const total = Object.values(panier).reduce((a, b) => a + b, 0);
  document.getElementById("cart-badge").textContent = total;
}

function afficherContenuPanier() {
  const itemsEl  = document.getElementById("panier-items");
  const footerEl = document.getElementById("panier-footer");
  const articles = Object.entries(panier).filter(([, q]) => q > 0);

  if (articles.length === 0) {
    itemsEl.innerHTML = `
      <div class="panier-vide">
        Votre panier est vide.<br>Ajoutez des produits pour commencer !
      </div>`;
    footerEl.innerHTML = "";
    return;
  }

  itemsEl.innerHTML = articles.map(([id, qte]) => {
    const p = produits.find(x => x.id == id);
    return `
      <div class="panier-item">
        <img class="pi-img" src="${p.img}" alt="${p.nom}"
             onerror="this.src='logo-original.png';" />
        <div class="pi-info">
          <div class="pi-nom">${p.nom}</div>
          <div class="pi-prix">${(p.prix * qte).toLocaleString("fr-FR")} FCFA</div>
          <div class="pi-qty">
            <button onclick="retirerDuPanier(${id})" aria-label="Diminuer">−</button>
            <span>${qte}</span>
            <button onclick="augmenterQte(${id})" aria-label="Augmenter">+</button>
          </div>
        </div>
      </div>`;
  }).join("");

  const montantTotal = articles.reduce((acc, [id, q]) => {
    const p = produits.find(x => x.id == id);
    return acc + p.prix * q;
  }, 0);

  footerEl.innerHTML = `
    <div class="panier-total">
      <span>Total</span>
      <span>${montantTotal.toLocaleString("fr-FR")} FCFA</span>
    </div>
    <a href="paiement.html" class="btn-primary" style="width:100%;text-align:center;display:block;margin-top:14px">
      Passer la commande
    </a>
    <p style="font-size:12px;color:var(--gris);text-align:center;margin-top:10px">Paiement 100% sécurisé</p>`;
}

// ===========================
// OUVRIR / FERMER PANIER
// ===========================
function ouvrirPanier() {
  document.getElementById("panier-sidebar").classList.add("open");
  document.getElementById("panier-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function fermerPanier() {
  document.getElementById("panier-sidebar").classList.remove("open");
  document.getElementById("panier-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

// ===========================
// CONTACT
// ===========================
function envoyerMessage(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button[type=submit]");
  btn.textContent = "Message envoyé";
  btn.style.background = "#1D9E75";
  btn.disabled = true;
  e.target.reset();
  setTimeout(() => {
    btn.textContent = "Envoyer le message";
    btn.style.background = "";
    btn.disabled = false;
  }, 3000);
}

// ===========================
// INIT
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  afficherProduits();
  initialiserFiltres();
  afficherContenuPanier();
  mettreAJourBadge();
  document.getElementById("btn-cart").addEventListener("click", ouvrirPanier);
});

// RECHERCHE
  function toggleRecherche() {
    const barre = document.getElementById('barre-recherche');
    const input = document.getElementById('input-recherche');
    if (barre.style.display === 'none') {
      barre.style.display = 'block';
      input.focus();
    } else {
      barre.style.display = 'none';
      input.value = '';
      afficherProduits();
    }
  }

  function rechercherProduit(query) {
    const grille = document.getElementById('produits-grid');
    const q = query.toLowerCase().trim();
    if (!q) { afficherProduits(); return; }
    const resultats = produits.filter(p =>
      p.nom.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q)
    );
    if (resultats.length === 0) {
      grille.innerHTML = '<p style="color:var(--gris);text-align:center;padding:40px;">Aucun produit trouvé.</p>';
      return;
    }
    grille.innerHTML = resultats.map((p, index) => {
      const dansLePanier = panier[p.id] > 0;
      const badgeHTML = p.badge === "new" ? '<span class="produit-badge badge-new">Nouveau</span>'
        : p.badge === "promo" ? '<span class="produit-badge badge-promo">Promo</span>' : "";
      return `
        <div class="produit-card" style="animation-delay:${index * 0.05}s">
          <div class="produit-img">${badgeHTML}
            <img src="${p.img}" alt="${p.nom}" loading="lazy"
                 onerror="this.src='logo-original.png';" />
          </div>
          <div class="produit-body">
            <div class="produit-cat">${p.cat}</div>
            <div class="produit-nom">${p.nom}</div>
            <div class="produit-footer">
              <span class="produit-prix">${p.prix.toLocaleString("fr-FR")} F</span>
              <button class="btn-ajouter ${dansLePanier ? "ajoute" : ""}" onclick="ajouterAuPanier(${p.id})">
                ${dansLePanier ? "Ajouté" : "+ Ajouter"}
              </button>
            </div>
          </div>
        </div>`;
    }).join("");
  }
});
