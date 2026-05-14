# Controle des engagements - France NAP Limoges 2026

Cet outil local sert a croiser :

- les resultats de Dijon ;
- les resultats de Rennes ;
- les resultats de Aix-en-Provence ;
- les engagements juniors / seniors ;
- les engagements cadets ;
- les courses bonus.

## Regles implementees

- Les cadets sont affiches et comptes, sans controle automatique de qualification.
- Les juniors et seniors doivent etre retrouves au moins une fois dans les resultats de Rennes ou de Aix-en-Provence.
- Les cadets n'ont pas d'obligation de presence a Rennes ou Aix.
- Les courses bonus des cadets sont acceptees automatiquement, y compris lorsqu'elles relevent d'une competition regionale.
- Les courses bonus juniors / seniors sont validees automatiquement si la meme epreuve est retrouvee dans les resultats de Dijon, Rennes ou Aix.
- Si une course bonus junior / senior n'est pas retrouvee dans ces trois fichiers mais que le nageur etait present a Rennes, elle est acceptee automatiquement comme course regionale.
- Les autres cas de bonus non retrouves restent classes en `A verifier`.
- Les nageurs engages uniquement en relais sont identifies et comptes.

## Colonnes attendues

Les imports acceptent un separateur `;`, `,` ou tabulation. Les colonnes prioritaires sont :

```text
club;licence;nom;prenom;categorie;epreuve
```

Quelques variantes proches sont egalement reconnues, par exemple `course` a la place de `epreuve`.

Les exports E-NAP natifs sont aussi reconnus directement :

- lignes `CLU` pour les clubs ;
- lignes `NAG` pour les nageurs et leurs engagements / resultats ;
- codes de categorie comme `FCA`, `HJU`, `FSE`, automatiquement convertis en `cadet`, `junior`, `senior`.

## Utilisation

1. Ouvrir `index.html`.
2. Cliquer sur `Charger les fichiers du dossier` si les six exports sont poses a cote de l'outil, ou les importer manuellement.
3. Cliquer sur `Verifier les engagements`.
4. Consulter les vues `Nageurs`, `Anomalies` et `Bonus`.
5. Utiliser les filtres par club, epreuve, statut ou recherche libre.
6. Exporter le controle au format CSV si besoin.

## Point a confirmer

La regle regionale des courses bonus a ete traitee prudemment en `A verifier` lorsqu'aucune trace n'est retrouvee dans Dijon, Rennes ou Aix. Cela evite de conclure automatiquement a une non-conformite sans disposer des resultats regionaux.
