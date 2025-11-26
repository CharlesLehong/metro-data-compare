"""
Municipality Data Analysis Dashboard
Analyzes Eskom municipality data comparing two time periods
"""

import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.patches import Circle
import numpy as np

# Configuration
DATA_FILE = 'Eskom_MUN_Data.csv'
PERIOD_1 = '2025-04-01'  # Change these to your desired periods
PERIOD_2 = '2025-05-01'

def load_data(filepath):
    """Load and prepare the municipality data"""
    print(f"Loading data from {filepath}...")
    df = pd.read_csv(filepath, encoding='utf-8-sig')
    
    # Convert TOT_DEBT to numeric
    df['TOT_DEBT'] = pd.to_numeric(df['TOT_DEBT'], errors='coerce').fillna(0)
    
    print(f"Loaded {len(df):,} records")
    return df

def get_available_periods(df):
    """Get all available periods in the dataset"""
    periods = df['MONTH'].unique()
    periods = sorted([p for p in periods if pd.notna(p)], reverse=True)
    return periods

def filter_by_period(df, period):
    """Filter data by specific period"""
    return df[df['MONTH'] == period].copy()

def get_metro_count(df):
    """Count Metro vs Non-Metro municipalities"""
    metro_count = len(df[df['METRO'] == 'Metro'])
    non_metro_count = len(df[df['METRO'] != 'Metro'])
    return {
        'metro': metro_count,
        'non_metro': non_metro_count,
        'total': metro_count + non_metro_count
    }

def get_debt_by_metro(df):
    """Calculate total debt by Metro status"""
    metro_debt = df[df['METRO'] == 'Metro']['TOT_DEBT'].sum()
    non_metro_debt = df[df['METRO'] != 'Metro']['TOT_DEBT'].sum()
    return {
        'metro': metro_debt,
        'non_metro': non_metro_debt,
        'total': metro_debt + non_metro_debt
    }

def calculate_deviation(value1, value2):
    """Calculate deviation and percentage change"""
    deviation = value2 - value1
    if value1 != 0:
        percentage = (deviation / value1) * 100
    else:
        percentage = 0
    return {
        'deviation': deviation,
        'percentage': percentage,
        'direction': 'increase' if deviation > 0 else 'decrease' if deviation < 0 else 'no change'
    }

def format_currency(amount):
    """Format amount as South African Rand"""
    return f"R {amount:,.2f}"

def create_donut_chart(ax, data, labels, colors, title, center_text='', center_subtext=''):
    """Create a donut chart"""
    wedges, texts, autotexts = ax.pie(
        data, 
        labels=labels,
        colors=colors,
        autopct='%1.1f%%',
        startangle=90,
        pctdistance=0.85,
        wedgeprops=dict(width=0.4, edgecolor='white', linewidth=2)
    )
    
    # Add center text
    if center_text:
        ax.text(0, 0.1, center_text, ha='center', va='center', fontsize=16, fontweight='bold')
    if center_subtext:
        ax.text(0, -0.15, center_subtext, ha='center', va='center', fontsize=10, color='gray')
    
    ax.set_title(title, fontsize=12, fontweight='bold', pad=20)
    
    return wedges, texts, autotexts

def create_gauge_chart(ax, value1, value2, title, unit='count'):
    """Create a deviation gauge visualization"""
    deviation = value2 - value1
    percentage = (deviation / value1 * 100) if value1 != 0 else 0
    
    # Determine color based on deviation
    if deviation > 0:
        color = '#ef4444'  # Red for increase
        direction = '↑'
    elif deviation < 0:
        color = '#22c55e'  # Green for decrease
        direction = '↓'
    else:
        color = '#94a3b8'  # Gray for no change
        direction = '→'
    
    # Remove axis
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    
    # Add main deviation text
    if unit == 'currency':
        deviation_text = format_currency(abs(deviation))
    else:
        deviation_text = f"{abs(deviation):,.0f}"
    
    if deviation > 0:
        deviation_display = f"+{deviation_text}"
    else:
        deviation_display = deviation_text if deviation == 0 else f"-{deviation_text}"
    
    # Display
    ax.text(0.5, 0.7, direction, ha='center', va='center', fontsize=60, color=color)
    ax.text(0.5, 0.45, deviation_display, ha='center', va='center', 
            fontsize=24, fontweight='bold', color=color)
    ax.text(0.5, 0.3, f"{abs(percentage):.1f}% {direction[:-1] if deviation != 0 else 'no change'}", 
            ha='center', va='center', fontsize=11, color='gray')
    
    # Period comparison
    if unit == 'currency':
        v1_text = format_currency(value1)
        v2_text = format_currency(value2)
    else:
        v1_text = f"{value1:,.0f}"
        v2_text = f"{value2:,.0f}"
    
    ax.text(0.25, 0.1, f"Period 1\n{v1_text}", ha='center', va='center', fontsize=9)
    ax.text(0.75, 0.1, f"Period 2\n{v2_text}", ha='center', va='center', fontsize=9)
    
    ax.set_title(title, fontsize=12, fontweight='bold', pad=20)

def main():
    """Main analysis function"""
    # Load data
    df = load_data(DATA_FILE)
    
    # Show available periods
    periods = get_available_periods(df)
    print("\nAvailable periods:")
    for i, period in enumerate(periods[:10], 1):
        print(f"  {i}. {period}")
    
    # Filter data by periods
    period1_data = filter_by_period(df, PERIOD_1)
    period2_data = filter_by_period(df, PERIOD_2)
    
    print(f"\nPeriod 1 ({PERIOD_1}): {len(period1_data):,} records")
    print(f"Period 2 ({PERIOD_2}): {len(period2_data):,} records")
    
    # Calculate metrics
    metro1 = get_metro_count(period1_data)
    metro2 = get_metro_count(period2_data)
    
    debt1 = get_debt_by_metro(period1_data)
    debt2 = get_debt_by_metro(period2_data)
    
    # Print analysis
    print("\n" + "="*60)
    print("METRO STATUS DISTRIBUTION")
    print("="*60)
    print(f"\n{PERIOD_1}:")
    print(f"  Metro:     {metro1['metro']:,}")
    print(f"  Non-Metro: {metro1['non_metro']:,}")
    print(f"  Total:     {metro1['total']:,}")
    
    print(f"\n{PERIOD_2}:")
    print(f"  Metro:     {metro2['metro']:,}")
    print(f"  Non-Metro: {metro2['non_metro']:,}")
    print(f"  Total:     {metro2['total']:,}")
    
    record_deviation = calculate_deviation(metro1['total'], metro2['total'])
    print(f"\nRecord Count Deviation: {record_deviation['deviation']:+,} ({record_deviation['percentage']:+.1f}%)")
    
    print("\n" + "="*60)
    print("TOTAL DEBT BY METRO STATUS")
    print("="*60)
    print(f"\n{PERIOD_1}:")
    print(f"  Metro Debt:     {format_currency(debt1['metro'])}")
    print(f"  Non-Metro Debt: {format_currency(debt1['non_metro'])}")
    print(f"  Total Debt:     {format_currency(debt1['total'])}")
    
    print(f"\n{PERIOD_2}:")
    print(f"  Metro Debt:     {format_currency(debt2['metro'])}")
    print(f"  Non-Metro Debt: {format_currency(debt2['non_metro'])}")
    print(f"  Total Debt:     {format_currency(debt2['total'])}")
    
    debt_deviation = calculate_deviation(debt1['total'], debt2['total'])
    print(f"\nTotal Debt Deviation: {format_currency(debt_deviation['deviation'])} ({debt_deviation['percentage']:+.1f}%)")
    
    # Create visualizations
    print("\n" + "="*60)
    print("Creating visualizations...")
    print("="*60)
    
    fig = plt.figure(figsize=(18, 10))
    fig.suptitle('Municipality Data Analysis Dashboard', fontsize=16, fontweight='bold')
    
    # Define colors
    metro_colors = ['#0ea5e9', '#06b6d4']
    debt_colors = ['#14b8a6', '#10b981']
    
    # Row 1: Metro Status Distribution
    ax1 = plt.subplot(2, 3, 1)
    create_donut_chart(
        ax1,
        [metro1['metro'], metro1['non_metro']],
        ['Metro', 'Non-Metro'],
        metro_colors,
        f'Metro Status - {PERIOD_1}',
        f"{metro1['total']:,}",
        'Total Records'
    )
    
    ax2 = plt.subplot(2, 3, 2)
    create_donut_chart(
        ax2,
        [metro2['metro'], metro2['non_metro']],
        ['Metro', 'Non-Metro'],
        metro_colors,
        f'Metro Status - {PERIOD_2}',
        f"{metro2['total']:,}",
        'Total Records'
    )
    
    ax3 = plt.subplot(2, 3, 3)
    create_gauge_chart(ax3, metro1['total'], metro2['total'], 'Record Count Deviation', unit='count')
    
    # Row 2: Total Debt Analysis
    ax4 = plt.subplot(2, 3, 4)
    create_donut_chart(
        ax4,
        [debt1['metro'], debt1['non_metro']],
        ['Metro', 'Non-Metro'],
        debt_colors,
        f'Total Debt - {PERIOD_1}',
        f"R {debt1['total']/1e6:.1f}M",
        'Total Debt'
    )
    
    ax5 = plt.subplot(2, 3, 5)
    create_donut_chart(
        ax5,
        [debt2['metro'], debt2['non_metro']],
        ['Metro', 'Non-Metro'],
        debt_colors,
        f'Total Debt - {PERIOD_2}',
        f"R {debt2['total']/1e6:.1f}M",
        'Total Debt'
    )
    
    ax6 = plt.subplot(2, 3, 6)
    create_gauge_chart(ax6, debt1['total'], debt2['total'], 'Total Debt Deviation', unit='currency')
    
    plt.tight_layout()
    
    # Save figure
    output_file = 'municipality_analysis_dashboard.png'
    plt.savefig(output_file, dpi=300, bbox_inches='tight')
    print(f"\nDashboard saved as: {output_file}")
    
    # Show plot
    plt.show()
    
    print("\nAnalysis complete!")

if __name__ == "__main__":
    main()
