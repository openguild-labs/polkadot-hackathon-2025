
ℹ️ You can check the Advanced Charts version by executing `TradingView.version()` in a browser console.

<!-- markdownlint-disable no-emphasis-as-header -->
<!-- markdownlint-disable no-inline-html -->
<!-- markdownlint-disable code-block-style -->

## Version 26.001

*Date: Tue Aug 08 2023*

**New Features**

- **Add series and study values to crosshair move event.** The [`crossHairMoved` subscription](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartWidgetApi/#crosshairmoved) now exposes the study and series values in the event object. The values are the same as the values shown in the data window.
- **Adding a new Floor type for calculating Pivot.**
- **Add the onHoveredSourceChanged method to the widget API.** See [`onHoveredSourceChanged`](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartWidgetApi/#onhoveredsourcechanged).

**Improvements**

- **Added optional variable_tick_size property to symbol info.**
- **Added onMoving to the Order Line Adapter.** [onMoving](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IOrderLineAdapter#onmoving)

**Bug Fixes**

- **Selecting an incorrect symbol within a study no longer prevents the study from recovering when a valid symbol is chosen later.**
- **Fix drawing tools not affecting undo/redo stack and chart layout saving buttons.** Drawing actions can now be undone/redone and will affect the saving of the chart layout
- **Disabling the 'open_account_manager' featureset now works as expected.**

**Other**

- **Watchlist sections featureset added for adjusting the visibility of the 'Add Section' button.** The UI for creating watchlist sections can now be hidden by disabling the [watchlist_sections](https://www.tradingview.com/charting-library-docs/latest/customization/Featuresets#watchlist_sections) featureset.

## Version 26

*Date: Tue Jul 18 2023*

**Breaking Changes**

- **Remove Lines item and submenu from background and symbol context menu.** The "lines" item has been removed from the context menu of the chart and the legend of the main series.

**New Features**

- **Adding more layouts to Trading Platform.** Users can display up to 16 charts on Trading Platform. (`Trading Platform Only`)
- **In bottom toolbar, tooltip text for date ranges has changed.** Hovering over the time frame buttons will provide more details to understand how chart is constructed.
- **Add setting for visibility of A (auto) and L (log) scale buttons.** In Chart settings, Scale tab, a new setting has been introduced to enable shortcuts for Auto & Logarithmic modes.
- **Bug in compare data displayed in Data window.** There was an issue where OHLC values would only be displayed in the data window widget when using the cross hair selection instead of displaying the data from the latest available bar if nothing was selected. Fixes [#7769](https://github.com/tradingview/charting_library/issues/7769)
- **Update chart maximization icon and remove animation.** Maximization button restyled
- **Price scale resizing while scrolling chart in mobile browser.** When scrolling into history the price scale expands to accommodate the values, but doesn't retract when the values become shorter. This is done to make the scale less twitchy during scrolling. The scale's width is reset on data loading.

**Improvements**

- **Fixed a bug where on some DPR there was no separator between the right widget panel and the order panel.** Now the separator line is always visible.
- **No bracket settings in chart settings.** Bracket settings were added to the Chart settings in the Trading tab.
- **Symbol logos within the Legend and Account Manager.** Symbol logos can now be displayed within the [Legend](https://www.tradingview.com/charting-library-docs/latest/ui_elements/Legend#displaying-logos-within-the-legend) and the Account Manager panel (`Trading Platform Only`) if the `show_symbol_logos` featureset is enabled.
  - `show_symbol_logo_in_legend` featureset can be disabled to hide the logos within the legend.
  - `show_symbol_logo_for_compare_studies` featureset can be disabled to hide the logos within the legend for compare overlay studies.
  - `show_symbol_logo_in_account_manager` featureset can be disabled to hide the logos within the Account Manager panel (`Trading Platform Only`).
- **Added setter and getter methods for CSS custom properties defined within the iframe.** The widget API now includes [setCSSCustomProperty](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartingLibraryWidget#setcsscustomproperty) and [getCSSCustomPropertyValue](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartingLibraryWidget#getcsscustompropertyvalue) methods for controlling CSS custom properties within the chart's iframe element.

**Other**

- **Deprecated properties and methods.** The following properties and methods are marked as deprecated and will be removed in the next major release:
  - `customFormatters` in the [ChartingLibraryWidgetOptions](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.ChartingLibraryWidgetOptions) interface. Use [`custom_formatters`](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.ChartingLibraryWidgetOptions/#custom_formatters) instead.
  - `customFormatters` and `brokerFactory` in the [TradingTerminalWidgetOptions](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.TradingTerminalWidgetOptions) interface. Use [`custom_formatters`](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.TradingTerminalWidgetOptions/#custom_formatters) and [`broker_factory`](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.TradingTerminalWidgetOptions/#broker_factory) instead.

## Version 25.002

*Date: Wed Jul 12 2023*

**New Features**

- **Add 52 Week High/Low study.**
- **Enable hiding price scales when all studies or series are hidden.** Adds the `hide_price_scale_if_all_sources_hidden` feature. When enabled price scales will be hidden when all studies (or the main series) attached to the price scale are hidden.
- **Option to always show legend values for studies on mobile.** By default, when on mobile, the legend won't display any values for studies.
Enabling this new `always_show_legend_values_on_mobile` featureset allows you to display the values.

**Improvements**

- **Sections can now be added within the Watchlist.** Sections dividers can now be added within the watchlist (`Trading Platform Only`).
  - Any item within a list which is prefixed with `###` will be considered a section divider. [API Reference](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartingLibraryWidget#watchlist)
- **Symbol and exchange logos can now be shown within the Compare Dialog.** The [symbol info](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.LibrarySymbolInfo) provided by [resolveSymbol](https://www.tradingview.com/charting-library-docs/latest/connecting_data/Datafeed-API#resolvesymbol) should now include 'exchange_logo' if you would like to use the 'show_exchange_logos' featureset.

**Bug Fixes**

- **Watermark API's content provider is now used for all charts within a multi-chart layout.**
- **Fixed issue with resetData.** When resetting the data for a chart, any existing studies would become unlinked from the data source. Fixes [#7802](https://github.com/tradingview/charting_library/issues/7802)
  - The `request_only_visible_range_on_reset` featureset now defaults to `disabled`.

## Version 25.001

*Date: Mon Jun 26 2023*

**Breaking Changes**

- **price_sources moved to symbol info.** To allow price sources resolved on-demand with the associated symbol the `price_sources` property has been removed from [the datafeed configuration object](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.DatafeedConfiguration) and added to the [symbol info object](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.LibrarySymbolInfo).

**New Features**

- **Added Market status state getter.** [marketStatus](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartWidgetApi#marketstatus) method is provided within [IChartWidgetApi](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartWidgetApi) which returns a watched value of the charts symbols current [market status](https://www.tradingview.com/charting-library-docs/latest/api/enums/Charting_Library.MarketStatus).
- **Symbol and exchange logos.** It is now possible to specify logo images for symbols and exchanges. These will be visible within the search dialog, and watchlist (Trading Platform). The `show_symbol_logos` and `show_exchange_logos` featuresets should be enabled, and your datafeed should be updated to provide urls as part of the symbol info supplied by the `resolveSymbol` method, and results supplied by the `searchSymbols` method.
- **Enable custom studies to extend the time scale.** Enable custom studies to extend the time scale with points that don't exist in the main series.
  - [See this article for more info](https://www.tradingview.com/charting-library-docs/latest/custom_studies/Studies-Extending-The-Time-Scale)
- **Added Custom Symbol Status API.** The new [Custom Symbol Status API](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.ICustomSymbolStatusApi) enables the creation and customisation of an additional status to be displayed for the symbol within the legend area.
  - The Custom Symbol Status API can be accessed via the [`customSymbolStatus`](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartingLibraryWidget#customsymbolstatus) method on the chart widget.
  - An example is provided on the [Symbol Status](https://www.tradingview.com/charting-library-docs/latest/ui_elements/Symbol-Status) page.
- **Featureset added for clearing the price scale on errors.** Added new `clear_price_scale_on_error_or_empty_bars` featureset to automatically clear pane price scales when the main series has an error or has no bars.
- **Adding Anchored VWAP in Trend line tools.** A new Trend line tool has been added to the already long list: Anchored VWAP.

**Improvements**

- **Added Watermark API.** The new [Watermark API](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IWatermarkApi) enables the customisation of the watermark text in addition to providing [WatchedValues](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IWatchedValue) for the color and visibility properties.
  - The Watermark API can be accessed via the [`watermark`](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartingLibraryWidget#watermark) method on the chart widget.
- **Updated broker API sample to support bracket orders.** The sample broker API has been updated to support brackets (stop loss, and take profit) orders. `Trading Platform Only`
- **Drawings in saved charts now restore with the saved settings for lock and disableSelection.** The `lock` and `disableSelection` settings for a created shape will now be saved and restored correctly. [#6761](https://github.com/tradingview/charting_library/issues/6761)
- **Fullscreen button can now be used to exit fullscreen mode as well.** When using the `header_in_fullscreen_mode` featureset, it is now possible to use the fullscreen button to exit fullscreen mode.
- **Added method to programmatically set the time frame for the active chart.** The [setTimeFrame](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartWidgetApi#settimeframe) method has been added to the widget which can set the time frame in a similar manner to the [Timeframes at the bottom of the chart](https://www.tradingview.com/charting-library-docs/latest/ui_elements/Time-Scale#timeframes-at-the-bottom-of-the-chart) buttons.
- **Renaming precision dropdown values in Chart settings.** To limit confusion when dealing with the Chart settings/Precision dropdown values, some fractional ones have been renamed to more readable ones.
- **Changing Source option in line-break & renko chart.** In Trading Platform, it was unnecessary to offer the option to change the source of data for both Renko and Line Break, as the data is taken from the close value.

**Bug Fixes**

- **Timescale marks will adjust correctly when widget theme is changed.**
- **onAutoSaveNeeded event emitted when removing all drawings via toolbar button.**
- **removeChart within the save load adapter will await the promise before updating the UI.**
- **First getBars request after resetting data no longer has a countback of zero.**
- **Market status pop up text could sometimes display Infinity or NaN values and not update on the dot.**
- **Fix custom field validators.** Fixes a bug where custom broker field validator functions were not called if provided.
- **Fixed rendering on price and time axes when a Trend Angle line drawing is selected.**

**Other**

- **Changed validation warning message within the close position UI.** Message changed from 'Specified value is more than the instrument maximum' to 'The amount entered exceeds the position size'.
- **Corrected the strings for the ThemeName type definition.** The possible values should have been lowercase: 'dark' & 'light'.
- **Moved Session breaks from Events to Appearance tab in chart options.** This reverts a breaking change made in `v25.0`.
- **Adding snippets for Trading Platform datafeed methods.** Some functions were lacking an out of the box snippet to use within their application.

## Version 25

*Date: Mon May 22 2023*

**Breaking Changes**

- **Save and Load Chart Templates.** Add methods to the [save/load adapter](https://www.tradingview.com/charting-library-docs/latest/saving_loading) to support chart templates.
- **Renew design for send order and buy sell buttons.** Renew design for send order and buy sell buttons:
  - Buttons are now rounded
  - Selected item and underline are now black
- **New TV logo.** What is changing:
  - Changing the size, boldness of the text
  - Indentation of the logo from the borders of the chart
- **One row for grid lines settings.** The grid lines settings have been combined into one row.
- **Remove magnet icon near cursor - Reverting feature.** Following reviews this piece of work was reverted.
- **Update Advanced Charts branding.** Branding font and position is slightly changed.
- **Do not load Euclid font for the branding logo on chart.** The Euclid font will not load if there is an animated logo on the chart.
- **When the chart data is reset, the new request for data will only be for the visible range.** The previous behavior was that when [resetData](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartWidgetApi#resetdata) was evoked, that the datafeed would be requested to provide data for the entire range of data already loaded for that symbol. The new behavior is that the request is now only for the current visible range. This more closely matches the behavior of the first load. If you require the old behavior then you can disable the `request_only_visible_range_on_reset` featureset.
- **Remove timezone & session breaks section from scale gear menu.** Time zone and Session breaks section has been removed from gear menu.
- **Update chart types icons.** Changed icons for Line, Area and Baseline chart types.
- ~~**Move Session breaks from Appearance to Events tab.** Session breaks setting is moved to events tab.~~ (Reverted in v25.001)
- **Changed the gear icon.** Changed the icon for price scale settings button ('gear' in bottom-right corner). See [#7666](https://github.com/tradingview/charting_library/issues/7666)
- **Chart navigation buttons.** Navigation buttons at the bottom of the chart have a slightly new design.

**New Features**

- **Adding a new chart type HLC Area.** HLC Area is a new chart type available.
- **Handle variable-tick-size.** Added support for variable tick size.
- **Add new stats position for info line drawing "auto".** Option of automatic positioning of information block for infoline drawings was added "auto" (in addition to existing left, center, right).
- **Add new checkboxes for price range in Info Line drawing box.** Added 2 settings in linetools context menu:
  - Percent change
  - Change in pips
- **Add ability to move anchors continuously - not by bars.** Smooth resizing of icons, stickers and emojis was implemented.
- **Correct Chart settings text Price scale labels.** "LABELS" group in "Scales" tab of Chart settings has been renamed to "LABELS ON PRICE SCALE".
- **Show + button on cursor by hotkey.** Added hotkeys Alt+Ctrl (win) or Opt+Command (mac) for the appearance of the plus button under the cursor.
- **Add Data window item to context/legend three dots menu.** Added new item to context/legend three dots menu - "Data window..." with a shortcut. Opens Data Window in the right panel.
- **Add Volume profile indicators on the top of chart series.** Changed the default z-order for Volume Profile indicators and VP drawings. They are now located above the main series.
- **Added new time zone Anchorage Alaska.** Added new time zone Anchorage Alaska (UTC-9).
- **Separate chart types Line with markers and Stepline.** Step line and Line with markers types are added to the top toolbar chart types menu.
- **Added new time zone Casablanca.** Timezone Casablanca (UTC) has been added.
- **Try to load line tools code dynamically.** Fixed floating toolbar for Price Note to show color and text settings like for other drawings.
- **Add sticker drawing tool.** Add the ability to use stickers with `createMultipointShape` or `selectLineTool`.
- **Add Accelerator Oscillator indicator.**

**Improvements**

- **Theming support for pop-up menus.** Additional CSS custom properties have been added for styling pop-up menus. Pop-up (as known as 'pop-over') menus include toolbar menus, and context menus. See the full list of CSS custom properties in the [CSS Color Themes](https://www.tradingview.com/charting-library-docs/latest/customization/styles/CSS-Color-Themes) article.
- **Add date and time input UI for custom studies.** [Custom studies](https://www.tradingview.com/charting-library-docs/latest/custom_studies) now support defining inputs of the `'time'` type and having a GUI element (date and time pickers) in the indicators settings dialog window.
- **setActiveChart added to the Widget API.** The currently active chart in a multi-chart layout (available on Trading Platform only) can now be changed using the `setActiveChart` method. [more info](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartingLibraryWidget#setactivechart)

**Bug Fixes**

- **Include missing PriceAxisLastValueMode and LineStyle enums in type documentation.**

**Documentation**

- **The Overrides article update.** We have updated the [Overrides](https://www.tradingview.com/charting-library-docs/latest/customization/overrides) article. Now it contains general information about the Overrides API. For information on how to customize elements on the chart, refer to a new [Chart Overrides](https://www.tradingview.com/charting-library-docs/latest/customization/overrides/chart-overrides) article.

## Version 24.004

*Date: Mon Apr 24 2023*

**New Features**

- **Indicators can now be favorited.** Indicators can now be favorited by tapping on the star icon to the left of the
indicator name. Favorited indicators will appear at the top of the indicator
list.
  - The `items_favoriting` featureset should be enabled. [more info](https://www.tradingview.com/charting-library-docs/latest/customization/Featuresets)
- **Adding two featuresets to hide the right_toolbar or its tabs.** There are 2 new featuresets `hide_right_toolbar` & `hide_right_toolbar_tabs` plus an additional WidgetBar API [changeWidgetBarVisibility](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IWidgetbarApi#changeWidgetBarVisibility) to control the right toolbar.
  - `hide_right_toolbar` allows you to instantiate the toolbar without showing it in the UI.
  - `hide_right_toolbar_tabs` will do the same with the exception of not showing tabs when displaying the right toolbar.

**Improvements**

- **Added a middle band for the RSI indicator.** Unlike on tradingview.com RSI was not presenting the option to plot a middle limit.
- **Indicators favorites can now be defined within widget constructor.** Indicators can now be defined as favorites using the [`favorites`](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.ChartingLibraryWidgetOptions#favorites) property of the widget constructor options. See [Favorites.indicators](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.Favorites#indicators) for more information.
- **Add a way to independently clear bar marks/timescale marks.** [`clearMarks`](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartWidgetApi#clearmarks) method has been enhanced to pass in an option to choose which marks should be cleared on the chart.
  - By default behaviour will remain similar and both bar & TimeScale marks will be removed.
  - Passing `ClearMarksMode.BarMarks` will only remove bar marks.
  - Passing `ClearMarksMode.TimeScaleMarks` will only remove TimeScale marks.
- **`BREAKING CHANGE` Discrepancy in chart style/type methods.** Only TypeScript breaking change as an interface has been renamed to better reflect its purpose.
`SeriesStyle` is now [SeriesType](https://www.tradingview.com/charting-library-docs/latest/api/enums/Charting_Library.SeriesType).

**Bug Fixes**

- **load_study_template event is not emitted.** load_study_template event was not emitted when applying a template on the chart.
- **Fixed autosize bug occurring on Chrome iOS when rotating the device.** Workaround fix for a browser bug until Chrome resolves the issue on their side.
- **Fixed the type definitions for a few of the PineJS Std library functions.** [PineJSStd documentation](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.PineJSStd).

**Documentation**

- **New Key Features article.** We have added the [Key Features](https://www.tradingview.com/charting-library-docs/latest/getting_started/Key-Features) article that lists features supported/unsupported in Advanced Charts and Trading Platform.
- **How to connect data via Datafeed API.** We have added a new [tutorial on connecting data via Datafeed API](https://www.tradingview.com/charting-library-docs/latest/tutorials/implement_datafeed_tutorial/).
It will help you implement datafeed and real-time data streaming to Advanced Charts step-by-step.

**Other**

- **Incorrect watermark property key.** Deprecated `symbolWatermarkProperties` property has now been removed.
Please use [settings_adapter](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.ChartingLibraryWidgetOptions#settings_adapter) with `symbolWatermark` key instead or `applyOverrides` to change values.

## Version 24.003

*Date: Tue Apr 11 2023*

**New Features**

- **Images within bar marks.** Bar marks now support the rendering of images as the background by specifying the `imageUrl` property. Please see the [Mark](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.Mark) interface for more details.
- **Price Source and Long Description symbol info fields.** Add support for displaying the price source and long description fields from the symbol info.
  - To enable the price source first add `symbol_info_price_source` to the list of enabled features. Then it will be shown in the legend, if available. It can be hidden through the legend context menu and the series property dialog.
  - To enable the long description first add `symbol_info_long_description` to the list of enabled features. Then it will be shown in the legend, if available. It can be hidden through the legend context menu and the series property dialog.

**Improvements**

- **Added more styling options for bar marks.** The styling options for bar marks has been expanded to include options for styling the border.
  - Border color can be set using the `border` property within `color` of the Mark interface. See [MarkCustomColor](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.MarkCustomColor)
  - Border width can be set using `borderWidth` and `hoveredBorderWidth`. See [Mark](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.Mark)
- **Drawing tools favorites can now be defined within widget constructor.** Drawing tools can now be defined as favorites using the [`favorites`](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.ChartingLibraryWidgetOptions#favorites) property of the widget constructor options. See [Favorites.drawingTools](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.Favorites#drawingtools) for more information.
- **Context menu API can now be used within the Watchlist.** `watchlist_context_menu` featureset is enabled by default. See [onContextMenu](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartingLibraryWidget#oncontextmenu) for more details.
- **Improved typings within package.json.** The `package.json` bundled with the library has been improved to support newer versions of node, and offer improved typings. See [NPM](https://www.tradingview.com/charting-library-docs/latest/getting_started/NPM) for more details.
- **Price scale now supports numbers with more than 10 decimal points.**
- **Timezone data has been updated.**

**Bug Fixes**

- **Chart type won't change when restoring default options.** The chart type will no longer change when restoring the default options within the chart settings dialog.
- **Last visible bar value in legend for overlay studies.** When `use_last_visible_bar_value_in_legend` featureset is enabled, overlay studies will display the value for the last visible item on the chart. This now matches the behavior for the main series.
- **Fixed zoom behavior for percentage right margin option.** Incorrect zooming behavior has been fixed for zoom buttons appearing on the chart, and the keyboard shortcuts. See `show_percent_option_for_right_margin` [featureset](https://www.tradingview.com/charting-library-docs/latest/customization/Featuresets) for more information.

**Documentation**

- **Add FAQ about unsubscribeBars delay.** Added [a new FAQ](https://www.tradingview.com/charting-library-docs/latest/getting_started/Frequently-Asked-Questions) about [`unsubscribeBars`](https://www.tradingview.com/charting-library-docs/latest/connecting_data/Datafeed-API#unsubscribebars) being called with a delay.

**Other**

- **Added symbol information to datafeed error messages.** Added symbol information to realtime subscription error messages to improve the developer experience.
- **Updated localisation list.** The [list of support localisations](https://www.tradingview.com/charting-library-docs/latest/core_concepts/Localization) has been updated. Additionally, the chart will now fallback to english (with a console warning) if an unsupported locale is specified in the widget constructor options.

## Version 24.002

**New Features**

- **Added support for specifying custom timezones.**
  - Additional custom timezones can now be specified for use within the library. Please see the [Adding Custom Timezones](../ui_elements/timezones#adding-custom-timezones) section within the Timezones page.
- **Images within timescale marks.**
  - Timescale marks now support the rendering of images within the circular shape by specifying the `imageUrl` property. Please see the [TimescaleMark](../api/interfaces/Charting_Library.TimescaleMark) interface for more details.
- **Support different margin rates for different order types.** [6607](https://github.com/tradingview/charting_library/issues/6607)
  - `marginRate` has been deprecated
  - A [`supportLeverageButton`](../api/interfaces/Broker.BrokerConfigFlags#supportleveragebutton) flag that displays a leverage button has been added to the Broker configuration.
  - The [`supportLeverage`](../api/interfaces/Broker.BrokerConfigFlags#supportleverage) flag enables leverage calculation by getting information from `leverageInfo`.

**Enhancements**

- Add horizontal line at 0 for Momentum study.

**Bug fixes**

- [`setUserEditEnabled`](../api/interfaces/Charting_Library.IStudyApi#setusereditenabled) does not hide 3 dots in Legend. [6765](https://github.com/tradingview/charting_library/issues/6765) | [6165](https://github.com/tradingview/charting_library/issues/6165)

      widget.activeChart().getAllStudies().forEach(({ id }) => {
        console.log(id);
        tvWidget.activeChart().getStudyById(id).setUserEditEnabled(false);
      });

  - setUserEditEnabled(false) should mask all icons except the "eye".
  - setUserEditEnabled(true) should restore all the icons.
- `priceFormatter` could previously only be used for main series. `priceFormatter` now applies to secondary series as well.
- `right_toolbar` featureset didn't have a default `on` value.
- Empty time frames at the bottom toolbar if `data_status: endofday`
- Export data doesn’t include projected data.
  - Projected data can be included by setting [`includeOffsetStudyValues`](../api/interfaces/Charting_Library.ExportDataOptions#includeoffsetstudyvalues) to `true`.
  - `await widget.activeChart().exportData({ includeOffsetStudyValues: true });`
- Highest PineJS.Std function doesn’t work correctly with negative numbers.
- Missing types in bundled definition file. [7445](https://github.com/tradingview/charting_library/issues/7445) | [7446](https://github.com/tradingview/charting_library/issues/7446)
- Exposing `icon` prop in `CreateShapeOptionsBase`. [6723](https://github.com/tradingview/charting_library/issues/6723)
- Wrong extended session background color [7443](https://github.com/tradingview/charting_library/issues/7443)

**Documentation**

- Added [migration guide](../trading_terminal/#how-to-migrate-from-charting-library) from TAC to CTP.
- Added additional documentation for [Drawings](../ui_elements/drawings/).
- Missing overrides in documentation. [7457](https://github.com/tradingview/charting_library/issues/7457)
- Updated documentation for [Marks](../ui_elements/Marks).
- Align ChartMetaInfo & ChartData.

**Other**

- Removed `Australia/ACT` from the list of [timezones](../ui_elements/timezones) within our documentation. Please use either the Sydney timezone or [specify your own custom timezone](../ui_elements/timezones#adding-custom-timezones).

## Version 24.001

**New Features**

- **Adding originalText as an additional field to UndoRedoState.** Event should mention the name of the action in plain English in addition to also being translated to the corresponding language. [UndoRedoState](@api/interfaces/Charting_Library.UndoRedoState#originalundotext)
- **Add the ability to change X-Axis margin % from Chart Properties.** A new [featureset](@docs/customization/Featuresets) has been added `show_percent_option_for_right_margin` that adds additional percentage option to the right margin section of the chart settings dialog.
- **Display rightmost visible value when in percent mode.** A new [featureset](@docs/customization/Featuresets) has been added `use_last_visible_bar_value_in_legend` to show the most recent “global” bar value. When this feature is enabled the rightmost bar in the visible range is used instead.
- **Ability to change on the fly the Currency and Unit label setting.** [currencyAndUnitVisibility API](@api/interfaces/Charting_Library.IChartingLibraryWidget#currencyandunitvisibility)
- **Add simple SSR support.** Allow the library to be imported within a NodeJS context. This improves support for frameworks such as Remix.
- **Added [`clearUndoHistory`](@api/interfaces/Charting_Library.IChartingLibraryWidget#clearundohistory).**

**Improvements**

- **Name to be used instead of ticker.** Allow a human friendly name to be returned from [`symbol_search_complete`](@api/interfaces/Charting_Library.ChartingLibraryWidgetOptions#symbol_search_complete).

**Bug Fixes**

- **Incomplete indicators when using Heikin-Ashi.** Indicator line should draw to all the visible data points.
- **Compare study doesn’t save and restore ticker name correctly.** The compare study should work for custom ticker names just like it does for ticker names which match our format (with the colon).
- **VPFR: Right point is automatically moving when dragging start point.** When drawing the VPFR, or moving one of the anchor points, it is expected that the right anchor point should not move one bar further to the right.
- **Selecting Apply Defaults option within chart settings doesn’t work.** Some Settings even if not validated are not restored to their original values when Apply Defaults is selected.
- **Decentralised app browser loading error.** Chart fails to load in wallet apps like MetaMask, Trust & Phantom. Enable the `iframe_loading_compatibility_mode` [featureset](@docs/customization/Featuresets) to enable compatibility with these browsers.
- **When disabled, widget bar still present a significant margin.** Even when there aren't any pages or widget in the right toolbar and IF right_toolbar is disabled, contrary to the drawing toolbar that vanishes the widget bar stays there with the pill button to expand it whereas there isn't anything to expand.
- **Can’t enable header_compare feature without header_symbol_search.**
  - Disabling header_symbol_search should only hide the search button
  - Disabling header_compare should only hide the compare button
- **Removed section of PostCSS syntax in bundled css files.**

**Other**

- **New Documentation site.** 🎉
- **Add `shape` to TimeScale.** Shape property is described in [TimescaleMark interface](@api/interfaces/Charting_Library.TimescaleMark#shape).
- **Remove magnet icon near cursor.**

## Version 24

- `preset` Widget-Constructor parameter has been removed. Users can still use some featuresets to mimic the same behavior by disabling the following list:
  - `'left_toolbar', 'header_widget', 'timeframes_toolbar', 'edit_buttons_in_legend', 'context_menus', 'control_bar', 'border_around_the_chart'`
- `chart_style_hilo` featureset is now enabled by default. This adds the High-low option to chart style controls dropdown. This featureset has been available since 1.15 but was previously disabled by default.
- Added typings for custom indicators. Typescript equivalents of our existing examples are available here: [Custom Studies Typescript Examples](../custom_studies/Custom-Studies-Examples).
- [`symbol_search_complete`](../api/interfaces/Charting_Library.ChartingLibraryWidgetOptions#symbol_search_complete) has changed. The function now takes an additional search result object parameter, and returns an additional human-friendly symbol name.

**UI changes**

- With this version you will notice that the top toolbar has been redesigned with the following changes:

  - Button padding & separator size have been reduced
  - Compare button has shifted next to Symbol
  - Drawing icon is now more prominent
  - New fullscreen icon
  - Save button style better highlights when there's a change
  - Top toolbar now extends to left & right edges
  - UI font changes to a default system one
  - Undo/redo buttons are now relocated next to the save button

**Trading Platform**

- Default formatter `textNoWrap` has been removed.
- `columnId` field of [SortingParameters](../api/interfaces/Broker.SortingParameters) has been renamed to `property`.
- Required `id` field has been added to [column description](../api/interfaces/Broker.AccountManagerColumnBase#id).
- Type of `formatter` field in [column description](../api/interfaces/Broker.AccountManagerColumnBase#formatter) has been changed to [StandardFormatterName | FormatterName](../api/enums/Charting_Library.StandardFormatterName).
- `property` field has been removed from `column description`. Use [dataFields](../api/interfaces/Broker.AccountManagerColumnBase#datafields) field instead.
- Type of `formatter` field in [SummaryField](../api/interfaces/Broker.AccountManagerSummaryField) has been changed to [StandardFormatterName](../api/enums/Charting_Library.StandardFormatterName).

## Older Versions

For breaking changes on older versions of the library please consult this page: [Breaking Changes](https://github.com/tradingview/charting_library/wiki/Breaking-Changes)
