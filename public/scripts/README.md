# Municipality Data Analysis - Python Script

This Python script performs the same analysis as the web dashboard, comparing Eskom municipality data across two time periods.

## Requirements

Install the required Python packages:

```bash
pip install pandas matplotlib numpy
```

## Usage

1. Download the script `municipality_analysis.py`
2. Place your `Eskom_MUN_Data.csv` file in the same directory
3. Edit the script to set your desired periods:
   ```python
   PERIOD_1 = '2025-04-01'  # Change to your first period
   PERIOD_2 = '2025-05-01'  # Change to your second period
   ```
4. Run the script:
   ```bash
   python municipality_analysis.py
   ```

## Output

The script will:
- Print a detailed console report with all metrics
- Generate a dashboard visualization (`municipality_analysis_dashboard.png`)
- Display the visualization in a window

## Features

### Metro Status Distribution
- Count of Metro vs Non-Metro municipalities for each period
- Visual donut charts showing the distribution
- Deviation gauge showing the change between periods

### Total Debt Analysis
- Total debt broken down by Metro status
- Visual donut charts showing debt distribution
- Deviation gauge showing debt changes in ZAR

## Customization

You can modify the script to:
- Change the periods being compared (update `PERIOD_1` and `PERIOD_2`)
- Add additional analysis (provinces, aging buckets, etc.)
- Customize colors and chart styles
- Export data to Excel or other formats

## Data Format

The script expects a CSV file with these columns:
- MONTH: Date in format YYYY-MM-DD
- METRO: 'Metro' or other value
- TOT_DEBT: Numeric debt amount
- Other columns from the Eskom municipality dataset
