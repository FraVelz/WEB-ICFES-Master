import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { ShopItemPreview } from '@/features/store/components/ShopItemPreview';
import { getShopItemById } from '@/features/store/data/shopCatalog';
import type { ProfileStoreHighlight } from '@/features/user/utils/profileStoreHighlights';

type ProfileStoreHighlightsProps = {
  highlights: ProfileStoreHighlight[];
  title?: string;
  emptyMessage?: string;
  onGoToStore?: () => void;
};

export function ProfileStoreHighlights({
  highlights,
  title = 'Colección de la tienda',
  emptyMessage = 'Aún no tienes ítems de la tienda.',
  onGoToStore,
}: ProfileStoreHighlightsProps) {
  if (highlights.length === 0 && !onGoToStore) {
    return null;
  }

  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/80 rounded-2xl border p-6',
        'shadow-sm dark:border-slate-800 dark:bg-slate-900/50'
      )}
    >
      <h2 className="text-on-surface mb-6 flex items-center gap-3 text-xl font-bold">
        <Icon name="shopping-bag" className="text-amber-600 dark:text-yellow-400" />
        {title}
      </h2>

      {highlights.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {highlights.map((item) => {
            const shopItem = getShopItemById(item.id);
            return (
              <div
                key={item.id}
                className={cn(
                  'flex items-center gap-4 rounded-xl border p-4 transition-colors',
                  item.category === 'badge'
                    ? 'border-amber-500/30 bg-amber-50/80 dark:border-yellow-500/25 dark:bg-yellow-500/5'
                    : 'border-surface-border bg-surface-via/60 dark:border-slate-700 dark:bg-slate-800/40',
                  item.isEquipped && 'ring-app-ring/40 ring-2'
                )}
              >
                <div className="shrink-0">
                  {shopItem ? (
                    <ShopItemPreview item={shopItem} variant="card" className="h-14 w-14" />
                  ) : (
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br text-white',
                        item.color
                      )}
                    >
                      <Icon name={item.icon} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-on-surface truncate font-semibold">{item.name}</p>
                    {item.isEquipped && (
                      <span className="border-app-ring/30 bg-app-ring/10 text-app-accent-strong dark:text-app-accent rounded-full border px-2 py-0.5 text-[10px] font-bold">
                        Equipado
                      </span>
                    )}
                  </div>
                  <p className="text-on-surface-muted mt-0.5 line-clamp-2 text-sm">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-on-surface-muted py-6 text-center">
          <p>{emptyMessage}</p>
          {onGoToStore && (
            <button
              type="button"
              onClick={onGoToStore}
              className={cn(
                'mt-4 cursor-pointer rounded-lg border border-amber-500/30 bg-amber-50 px-4 py-2',
                'text-sm font-semibold text-amber-800 transition-colors',
                'hover:bg-amber-100 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400 dark:hover:bg-yellow-500/20'
              )}
            >
              Ir a la tienda
            </button>
          )}
        </div>
      )}
    </div>
  );
}
