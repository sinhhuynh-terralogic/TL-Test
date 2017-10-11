import _ from 'lodash';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import ComponentTitle from 'components/shared/ComponentTitle';
import ChevronRight from 'components/icons/ChevronRight';
import Pagination from 'components/icons/Pagination';
import Timestamp from 'components/custom/griffin/Timestamp';

const STORY = 'story';

const GRID_ITEM_HEIGHT = 140;
const HERO_ITEM_HEIGHT = 280;

const INNER_TITLE_PLACEMENT = 'inner';
const OUTER_TITLE_PLACEMENT = 'outer';

const layoutType = {
  HERO: 'hero',
  GRID: 'grid',
  GRIFFIN: 'griffin'
};

const heroPlacementType = {
  TOP: 'top',
  LEFT: 'left'
};

const titlePlacementType = {
  INNER: 'inner',
  OUTER: 'outer'
}

const ItemsPropTypes = {
  columnGridCount: PropTypes.number.isRequired,
  textColor: PropTypes.string,
  showTimestamp: PropTypes.bool,
  padding: PropTypes.number,
  showPill: PropTypes.bool,
  videoIconPlacement: PropTypes.string,
  timestampOptions: PropTypes.shape({
    showElapsedTime: PropTypes.bool,
    displayShortDateTime: PropTypes.bool
  })
};

const CategoryGridPropTypes = {
  layout: PropTypes.string,
  showPagination: PropTypes.bool,
  rowGridCount: PropTypes.number.isRequired,
  heroPlacement: PropTypes.string,
  heroCount: PropTypes.number,
  ...ItemsPropTypes
};

class CategoryGridWrapper extends Component {
  static propTypes = {
    FRN_rawResponses: PropTypes.array,
    title: PropTypes.string,
    titleColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    showReadMore: PropTypes.bool,
    categoryUrl: PropTypes.string,
    startArticleIndex: PropTypes.number,
    totalNumberOfItems: PropTypes.number,
    ...CategoryGridPropTypes
  }

  static defaultProps = {
    layout: layoutType.GRID,
    startArticleIndex: 0,
    totalNumberOfItems: 7,
    heroPlacement: heroPlacementType.TOP,
    heroCount: 1,
    rowGridCount: 1,
    columnGridCount: 1,
    columnFirstGriffinCount: 1,
    columnSecondGriffinCount: 1,
    columnThirdGriffinCount: 0,
    backgroundColor: '#FFFFFF',
    textColor: '#FFFFFF',
    titleColor: '#313131',
    showPagination: false,
    showTimestamp: true,
    showReadMore: false,
    padding: 2,
    expandBackground: false,
    videoIconPlacement: 'center'
  }
  

  render() {
      const {
        FRN_rawResponses: [{
          data: {
            features: items = [],
            headline = ''
          } = {}
        } = {}] = [],
        title,
        layout,
        titleColor,
        backgroundColor,
        textColor,
        showReadMore,
        showTimestamp,
        showPill,
        categoryUrl,
        totalNumberOfItems,
        startArticleIndex,
        showPagination,
        heroPlacement,
        heroCount,
        rowGridCount,
        columnGridCount,
        videoIconPlacement,
        columnFirstGriffinCount,
        columnSecondGriffinCount,
        columnThirdGriffinCount,
        timestampOptions = {},
        titlePlacement = {},
        expandBackground
      } = this.props;

      const maxValueViolation = (field, value) => {
        return ` the ${field} field must be less than ${value}`;
      };
      const minValueViolation = (field, value) => {
        return ` the ${field} field must be greater than ${value}`;
      };

      const validate = (value, field, constraint) => {
        const errors = [];

        if (constraint.min !== 'undefined' && value < constraint.min) {
          errors.push(minValueViolation(field, constraint.min));
        }
        if (constraint.max !== 'undefined' && value > constraint.max) {
          errors.push(maxValueViolation(field, constraint.max));
        }

        return errors;
      };

      let validationRules = {};
      if (layout === layoutType.GRID) {
        validationRules = {
          rowGridCount: {
            min: 1
          },
          columnGridCount: {
            min: 1,
            max: 6
          },
          heroCount: {},
          columnGriffinCount: {}
        };
      } else if (layout === layoutType.HERO) {
        validationRules = {
          rowGridCount: {
            min: 0
          },
          columnGridCount: {
            min: 0,
            max: heroPlacement === heroPlacementType.LEFT ? 3 : 6
          },
          heroCount: {
            min: 1,
            max: 3
          },
          columnGriffinCount: {}
        };
      } else if (layout === layoutType.GRIFFIN) {
        validationRules = {
          rowGridCount: {},
          columnGridCount: {},
          heroCount: {},
          columnGriffinCount: {
            min: 1,
            max: 4
          }
        };
      }

      const errors = [];
      errors.push(...validate(columnGridCount, 'columnGridCount', validationRules.columnGridCount));
      errors.push(...validate(rowGridCount, 'rowGridCount', validationRules.rowGridCount));
      errors.push(...validate(heroCount, 'heroCount', validationRules.heroCount));
      errors.push(...validate(columnFirstGriffinCount, 'columnFirstGriffinCount', validationRules.columnGriffinCount));
      errors.push(...validate(columnSecondGriffinCount, 'columnSecondGriffinCount', validationRules.columnGriffinCount));
      if (columnThirdGriffinCount > 0) {
       errors.push(...validate(columnThirdGriffinCount, 'columnThirdGriffinCount', validationRules.columnGriffinCount));
      }

      if (errors.length) {
        errors.unshift(`When layout is ${layout}${layout === layoutType.HERO ? ` and heroPlacement is ${heroPlacement}` : ''}`);
        throw new Error(errors);
      }

    const offset = Math.max(startArticleIndex, 0);
    const itemsToShow = items.slice(offset, totalNumberOfItems + offset);

    if (!itemsToShow.length) {
      return null;
    }

    const totalItemsOfPage = rowGridCount * columnGridCount;
    const backgroundClasses = classNames(
      'CategoryGrid-background',
      { expandToEdges: expandBackground });

    return (
      <div className="CategoryGrid" style={{backgroundColor}}>
        {title ?
          <Row>
            <ComponentTitle color={titleColor} title={title} />
            {showReadMore && categoryUrl ?
              <div className="CategoryGrid-readMore">
                <a href={categoryUrl}> <ChevronRight color="#CCC" /> </a>
              </div> : null}
          </Row> : null}
          <CategoryGrid
            items={itemsToShow}
            layout={layout}
            showPagination={showPagination}
            heroPlacement={heroPlacement}
            heroCount={heroCount}
            columnGridCount={columnGridCount}
            rowGridCount={rowGridCount}
            columnFirstGriffinCount={columnFirstGriffinCount}
            columnSecondGriffinCount={columnSecondGriffinCount}
            columnThirdGriffinCount={columnThirdGriffinCount}
            titlePlacement={titlePlacement}
            textColor={textColor}
            titleColor={titleColor}
            showTimestamp={showTimestamp}
            showPill={showPill}
            padding={Math.round(this.props.padding / 2)}
            totalItemsOfPage={totalItemsOfPage}
            videoIconPlacement={videoIconPlacement}
            timestampOptions={timestampOptions}/>

          <span className={backgroundClasses} style={{backgroundColor}}></span>
      </div>
    );
  }
}

class CategoryGrid extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    totalItemsOfPage: PropTypes.number,
    ...CategoryGridPropTypes
  }

  state = {
    layout: this.props.layout,
    page: 0
  }

  _onNext(){
    const { page } = this.state;
    this.setState({
      page: page + 1,
      layout: layoutType.GRID
    });
  }

  _onBack(){
    let { page } = this.state;
    this.setState({
      page: page - 1,
      layout: this.props.layout === layoutType.HERO && page === 1 ? layoutType.HERO : layoutType.GRID
    });
  }

  _buildGridItems(_items, _columnGridCount, itemType, _height = GRID_ITEM_HEIGHT, titlePlacement = INNER_TITLE_PLACEMENT){
    const {
      textColor,
      showTimestamp,
      padding,
      showPill,
      videoIconPlacement,
      timestampOptions,
      titleColor
    } = this.props;

    return _items.map((item, index) => {
      return (
        <CategoryLink item={item} key={index} >
          <Item
            item={item}
            columnGridCount={_columnGridCount}
            itemType={itemType}
            height={_height}
            textColor={textColor}
            titleColor={titleColor}
            showTimestamp={showTimestamp}
            padding={padding}
            showPill={showPill}
            videoIconPlacement={videoIconPlacement}
            timestampOptions={timestampOptions}
            titlePlacement={titlePlacement}
        />
      </CategoryLink>);
    });
  }

  render() {
    const {
      items,
      showPagination,
      heroPlacement,
      heroCount,
      rowGridCount,
      columnGridCount,
      padding,
      totalItemsOfPage,
      titleColor,
      columnFirstGriffinCount,
      columnSecondGriffinCount,
      columnThirdGriffinCount,
      titlePlacement: {
        firstRow,
        secondRow,
        thirdRow
      } = {}
    } = this.props;

    const {
      layout,
      page
    } = this.state;

    const isHeroGrid = (this.props.layout === layoutType.HERO);

    const startIndex = page * totalItemsOfPage + (isHeroGrid && page !== 0 ? heroCount : 0);
    const lastIndex = startIndex + totalItemsOfPage + (isHeroGrid && page === 0 ? heroCount : 0);

    const pageItems = items.slice(startIndex, lastIndex);
    const totalPage = _.range(_.ceil(items.length / totalItemsOfPage));

    let canNext = true;
    let canBack = true;

    let content;
    switch (layout) {
      case layoutType.GRID:
        content = (
          <Row>{this._buildGridItems(pageItems, columnGridCount, layoutType.GRID)}</Row>
        );

        break;
      case layoutType.HERO:
        const heroItems = pageItems.slice(0, heroCount);
        const gridItems = pageItems.slice(heroCount, pageItems.length);
        switch (heroPlacement) {
          case heroPlacementType.TOP:
            content = [];

            content.push(
              <Row key={0}>{this._buildGridItems(heroItems, heroCount, layoutType.HERO, HERO_ITEM_HEIGHT)}</Row>
            );
            content.push(
              <Row key={1}>{this._buildGridItems(gridItems, columnGridCount, layoutType.GRID)}</Row>
            );

            break;
          case heroPlacementType.LEFT:
            const colProps = {
              xs: 12,
              md: 6
            };
            let height;

            if (rowGridCount === 0 || columnGridCount === 0){
              colProps['md'] = 12;
              height = HERO_ITEM_HEIGHT;
            } else {
              height = (rowGridCount * GRID_ITEM_HEIGHT + (rowGridCount - 1) * padding * 2);
              if (heroCount > 1) {
                height = height / heroCount - ((heroCount - 1) * padding * 2) / heroCount;
              }
            }

            content = (
              <Row>
                <Col {...colProps}>
                  <Row>{this._buildGridItems(heroItems, 1, layoutType.HERO, height)}</Row>
                </Col>
                <Col {...colProps}>
                  <Row>{this._buildGridItems(gridItems, columnGridCount, layoutType.GRID)}</Row>
                </Col>
              </Row>
            );

            break;
          default:
            console.log(`${heroPlacement} not supported.`);
            return null;
        }

        break;

      case layoutType.GRIFFIN:
        content = [];
        const firstGriffinCountItem = items.slice(0, columnFirstGriffinCount);
        const secondGriffinCountItem = items.slice(columnFirstGriffinCount, columnFirstGriffinCount + columnSecondGriffinCount);
        const thirdGriffinCountItem = items.slice(columnFirstGriffinCount + columnSecondGriffinCount, columnFirstGriffinCount + columnSecondGriffinCount + columnThirdGriffinCount);

        content.push(
          <Row key={0}>{this._buildGridItems(firstGriffinCountItem, columnFirstGriffinCount, layoutType.GRIFFIN, HERO_ITEM_HEIGHT, firstRow)}</Row>
        );
        content.push(
          <Row key={1}>{this._buildGridItems(secondGriffinCountItem, columnSecondGriffinCount, layoutType.GRIFFIN, GRID_ITEM_HEIGHT, secondRow)}</Row>
        );
        content.push(
          <Row key={2}>{this._buildGridItems(thirdGriffinCountItem, columnThirdGriffinCount, layoutType.GRIFFIN, (GRID_ITEM_HEIGHT*2)/3, thirdRow)}</Row>
        );
        break;

      default:
        console.log(`${layout} not supported.`);
        return null;
    }

    if (page === 0) {
      canBack = false;
    }

    if (items.length <= lastIndex) {
      canNext = false;
    }

    return (
      <div>
          {showPagination ?
            <div className="CategoryGrid-pagination">
              <ul className="CategoryGrid-pagination-dots">
                { totalPage.map((index) => {
                    const className = index === page ? 'CategoryGrid-pagination-dots-active' : null;
                    const dotsStyle = {
                      borderColor: titleColor
                    };

                    if (index === page) {
                      dotsStyle.backgroundColor = titleColor;
                    }

                    return ( <li key={index}><a className={className} style={dotsStyle}/></li>);
                  })
                }
              </ul>
              <button onClick={() => this._onBack()} disabled={canBack ? false : true}>
                <Pagination color={titleColor} direction="left" />
              </button>
              <button onClick={() => this._onNext()} disabled={canNext ? false : true}>
                <Pagination color={titleColor} direction="right" />
              </button>
            </div> : null}
        {content}
      </div>
    );
  }
}

class CategoryLink extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    children: PropTypes.node
  }

  render() {
    const {
      item: {
        type = '',
        id = '',
        seo: { pageurl: slug = ''} = {}
        } = {},
      } = this.props;

    let href;

    if (typeof location === 'undefined') {
      return this.props.children;
    } else {
      href = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/' + type + '/' + id + '/' + slug;
    }

    return (
      <a href={href}>
        {this.props.children}
      </a>
    );
  }
}

class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    height: PropTypes.number,
    itemType: PropTypes.string,
    showPill: PropTypes.bool,
    ...ItemsPropTypes
  }

  static defaultProps = {
    height: GRID_ITEM_HEIGHT,
    itemType: layoutType.GRID,
    showPill: false,
    titlePlacement: INNER_TITLE_PLACEMENT
  }

  render() {
    const {
      item: {
        headline = '',
        abstractimage: { filename: newsImage = '' } = {},
        surfaceable: [ { type: featureType = '' } = {} ] = [],
        type = '',
        contentClassification: pillLabel = '',
        publishedDate
      } = {},
      columnGridCount,
      textColor,
      showTimestamp,
      timestampOptions: {
        showElapsedTime,
        displayShortDateTime
      } = {},
      padding,
      height,
      itemType,
      showPill,
      videoIconPlacement,
      titlePlacement,
      titleColor
    } = this.props;

    const wrapperStyles = {
      height: `${height}px`,
      backgroundImage: newsImage ? `url(${newsImage})` : null
    };

    const lg = 12 / columnGridCount;

    const maxCol = (col) => {
      return Math.max(col, lg);
    };

    const isHeroGrid = (itemType === layoutType.HERO);

    const colProps = {
      lg: columnGridCount !== 5 ? lg : null,
      md: maxCol(3),
      sm: isHeroGrid ? maxCol(6) : maxCol(4),
      xs: isHeroGrid ? 12 : maxCol(6)
    };

    const isVideoAttached = featureType.toLowerCase() === 'clip' || type.toLowerCase() === 'clip';

    const imageThumbnailClassName = classNames(
      'CategoryGrid-thumbnail',
      'embed-responsive embed-responsive-16by9',
      {
        'CategoryGrid-element CategoryGrid-coverPhoto': isHeroGrid,
        'CategoryGrid-gridItem CategoryGrid-item': !isHeroGrid
      }
    );
    const headlineSmallClassName = classNames(
      'CategoryGrid-headlineSmall',
      {
        'CategoryGrid-headlineSmall-videoThumnail': isVideoAttached
      }
    )

    return (
      <Col {...colProps} className={`CategoryGrid-itemWraper ${columnGridCount === 5 ? 'col-lg-5ths' : ''}`} style={{padding: `${padding}px`}}>
        <div className={imageThumbnailClassName} style={wrapperStyles}>
          <div className="CategoryGrid-pictureText">
            {showPill ? <span className="CategoryGrid-categoryHeader">{pillLabel}</span> : null}
            {titlePlacement === titlePlacementType.INNER ?
              <p className={headlineSmallClassName} style={{color: textColor}}>{headline}</p> : null
            }
            {/* Pending Updated and Published timestamps from ticket WEB-566 */}
            {showTimestamp && titlePlacement === titlePlacementType.INNER ? <Timestamp publishDate={publishedDate} showElapsedTime={showElapsedTime} displayShortDateTime={displayShortDateTime}/> : null}
          </div>
        </div>
        {titlePlacement === titlePlacementType.OUTER ?
            <p className={headlineSmallClassName} style={{color: titleColor}}>{headline}</p> : null
        }
      </Col>
    );
  }
}

export default CategoryGridWrapper;
