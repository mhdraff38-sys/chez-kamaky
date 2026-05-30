// ===========================
// DONNÉES PRODUITS
// ===========================
const produits = [
  { id: 1,  nom: "Boubou africain",       cat: "Vêtements",    prix: 15000, emoji: "👘", badge: "new"   },
  { id: 2,  nom: "Chemise wax homme",     cat: "Vêtements",    prix: 8500,  emoji: "👔", badge: null    },
  { id: 3,  nom: "Robe pagne femme",      cat: "Vêtements",    prix: 12000, emoji: "👗", badge: "promo" },
  { id: 4,  nom: "T-shirt coton premium", cat: "Vêtements",    prix: 5500,  emoji: "👕", badge: null    },
  { id: 5,  nom: "Sneakers blanc",        cat: "Chaussures",   prix: 18500, emoji: "👟", badge: "new"   },
  { id: 6,  nom: "Sandales cuir",         cat: "Chaussures",   prix: 9000,  emoji: "🥿", badge: null    },
  { id: 7,  nom: "Mocassins homme",       cat: "Chaussures",   prix: 14000, emoji: "👞", badge: "promo" },
  { id: 8,  nom: "Tongs artisanales",     cat: "Chaussures",   prix: 4500,  emoji: "🩴", badge: null    },
  { id: 9,  nom: "Smartphone 128 Go",     cat: "Électronique", prix: 95000, emoji: "📱", badge: "new"   },
  { id: 10, nom: "Écouteurs sans fil",    cat: "Électronique", prix: 22000, emoji: "🎧", badge: null    },
  { id: 11, nom: "Chargeur rapide 65W",   cat: "Électronique", prix: 8500,  emoji: "🔌", badge: "promo" },
  { id: 12, nom: "Montre connectée",      cat: "Électronique", prix: 35000, emoji: "⌚", badge: null    },
  { id: 13, nom: "Panier tressé",         cat: "Artisanat",    prix: 6500,  emoji: "🧺", badge: null    },
  { id: 14, nom: "Masque décoratif",      cat: "Artisanat",    prix: 11000, emoji: "🎭", badge: "new"   },
  { id: 15, nom: "Collier bronze",        cat: "Artisanat",    prix: 5000,  emoji: "📿", badge: null    },
  { id: 16, nom: "Sculpture bois",        cat: "Artisanat",    prix: 28000, emoji: "🪵", badge: null    },
];

// ===========================
// ÉTAT
// ===========================
let categorieActive = "Tous";
let panier = {};

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
          ${p.emoji}
        </div>
        <div class="produit-body">
          <div class="produit-cat">${p.cat}</div>
          <div class="produit-nom">${p.nom}</div>
          <div class="produit-footer">
            <span class="produit-prix">${p.prix.toLocaleString("fr-FR")} F</span>
            <button class="btn-ajouter ${dansLePanier ? "ajoute" : ""}" onclick="ajouterAuPanier(${p.id})">
              ${dansLePanier ? "✓ Ajouté" : "+ Ajouter"}
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
  afficherContenuPanier();
  mettreAJourBadge();
  afficherProduits();
}

function augmenterQte(id) {
  panier[id] = (panier[id] || 0) + 1;
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
        <span>🛍️</span>
        Votre panier est vide.<br>Ajoutez des produits pour commencer !
      </div>`;
    footerEl.innerHTML = "";
    return;
  }

  itemsEl.innerHTML = articles.map(([id, qte]) => {
    const p = produits.find(x => x.id == id);
    return `
      <div class="panier-item">
        <span class="pi-emoji">${p.emoji}</span>
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
      𓇢 &nbsp; Passer la commande →
    </a>
    <p style="font-size:12px;color:var(--gris);text-align:center;margin-top:10px">🔒 Paiement 100% sécurisé</p>`;
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
  btn.textContent = "Message envoyé ✓";
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
