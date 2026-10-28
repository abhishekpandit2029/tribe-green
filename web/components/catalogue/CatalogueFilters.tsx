import { BUDGETS, CATEGORIES, OCCASIONS } from "../../data/catalogue";

type Props = {
  category: string;
  occasion: string;
  budget: string;
  search: string;
  onCategoryChange: (value: string) => void;
  onOccasionChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
  onSearchChange: (value: string) => void;
};

export function CatalogueFilters(props: Props) {
  return (
    <div className="filters">
      <div className="category-pills">
        {["All gifts", ...CATEGORIES].map((category) => (
          <button
            key={category}
            className={props.category === category ? "active" : ""}
            onClick={() => props.onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="filter-selects">
        <input
          aria-label="Search gifts"
          placeholder="Find a gift..."
          value={props.search}
          onChange={(event) => props.onSearchChange(event.target.value)}
        />
        <select
          value={props.occasion}
          onChange={(event) => props.onOccasionChange(event.target.value)}
        >
          <option value="">Every occasion</option>
          {OCCASIONS.map((occasion) => (
            <option key={occasion}>{occasion}</option>
          ))}
        </select>
        <select
          value={props.budget}
          onChange={(event) => props.onBudgetChange(event.target.value)}
        >
          <option value="">Every budget</option>
          {BUDGETS.map((budget) => (
            <option key={budget}>{budget}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
