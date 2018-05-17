import React from "react";
import PropTypes from "prop-types";
import { registerComponent, Components } from "@reactioncommerce/reaction-components";
import { Reaction } from "/client/api/index";
import { Logger } from "/lib/api";


class Hero extends React.Component {
  
  constructor(...args) {
    super(...args);
    this.tagRouteSlug = Reaction.Router.getParam("slug");
    console.warn('hero here');
  }

  heroClicked = () => {
    Logger.info("clicked");
  }

  handleClick = (event) => {
    event.preventDefault();
    Reaction.Router.go("/");
  }

  renderHero() {
    if (this.tagRouteSlug && this.props.tags) {
      console.warn('hero', this.props.tags);
      // Tag route
      const tag = this.props.tags.find((x) => x.slug === this.tagRouteSlug);
      if (!tag) {
        return <div></div>;
      }
      return (
        <div className="cat-hero" style={{ backgroundImage: `url('/resources/${tag.catHeroImageUrl}')` }} >
          <div className="cat-hero-wrapper">
            <div className="cat-hero-slogan">
              <Components.Translation defaultValue={"Lorem ipsum"} i18nKey={tag.catHeroSloganI18nKey} />
            </div>
            <div className="cat-hero-huge-text">
              <Components.Translation defaultValue={"Nuro laudio vid pastum"} i18nKey={tag.catHeroTitleI18nKey} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="hero">
        <div className="hero-wrapper">
          <div className="hero-slogan">
            <Components.Translation defaultValue={"We heard you like swag."} i18nKey={"weHeardYouLikeSwag"} />
          </div>
          <div className="hero-huge-text">
            <Components.Translation defaultValue={"You’re in the right place."} i18nKey={"youAreInTheRightPlace"} />
          </div>
        </div>
      </div>
    );
  }


  renderCategory(tag) {
    return (
      <div className={"cat-tile col-xs-12"} key={tag._id}>
        <a href={`/tag/${tag.slug}`} onClick={this.handleClick}>
          <img alt={tag.name} src={`/resources/${tag.catTileImageUrl}`} />
          <span className={"category"}>{tag ? tag.name : 'no-tag'}</span>
        </a>
      </div>
    );
  }

  renderCategoryChunks(tags) {
    const chunkSize = 2;
    const chunks = [];
    for (let i = 0; i < tags.length; i += chunkSize) {
      const temp = tags.slice(i, i + chunkSize);
      let className = "col-sm-4";
      if (i === 0) {
        className += " col-sm-pull-4";
      }
      chunks.push(<div className={className} key={i}>
        {temp.map((element, index) => this.renderCategory(element, index))}
      </div>);
    }
    return chunks;
  }

  shopAllLabel() {
    return (
      <span><Components.Translation defaultValue={"Shop all products"} i18nKey={"shopAllProducts"} />&nbsp;<i className="fa fa-long-arrow-right" /></span>
    );
  }

  renderCategories() {
    return (
      <div className={"categories row"}>
        <div className={"cat-tile col-xs-12 col-sm-push-4 col-sm-4"}>
          <div className={"pic-essentials"}>
            <div className={"btn-essentials"}>
              <Components.Button
                className={"btn-blue"}
                label={this.shopAllLabel()}
                bezelStyle={"solid"}
                primary={false}
                type="button"
                onClick={this.heroClicked}
              />
            </div>
          </div>
        </div>
        {this.renderCategoryChunks(this.props.tags)}
      </div>
    );
  }

  render() {
    return (
      <div>
        {Reaction.Router.getRouteName() === 'index' && this.renderHero()}
        {Reaction.Router.getRouteName() === 'index' && !this.tagRouteSlug && this.props.tags && this.renderCategories()}
        <div className="container-main">
          {!this.tagRouteSlug &&
          <div className="row">
            <div className="text-center">
              <h3 className="products-we-love-header">
                <Components.Translation defaultValue="Products We Love" i18nKey="productsWeLove" />
              </h3>
            </div>
          </div>}
        </div>
        {this.renderWordOfTheDay()}
        {this.renderImageGallery()}
      </div>
    );
  }

  renderWordOfTheDay() {
    if (Reaction.Router.getRouteName() === 'index') {
      return (
        <div className={"word-of-the-day"}>
          <div className={"word-of-the-day-header"}>
            <Components.Translation defaultValue={"#VASIOS"} i18nKey={"wordOfTheDayHeader"} />
          </div>
          <div className={"word-of-the-day-text"}>
            <a href="https://www.instagram.com/#vasios" title="Instagram">
              <Components.Translation defaultValue={"Shop your favorites on our Instagram feed."} i18nKey={"wordOfTheDayText"} />
            </a>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  renderImageGallery() {
    if (Reaction.Router.getRouteName() === 'index') {
      return (
        <div className="row image-gallery">
          <div className="col-xs-12 col-sm-5ths col-sm-push-2">
            <a href={"https://www.instagram.com/reactioncommerce/"} alt={"instagram"}>
              <img alt="Instagram" src={"/resources/palms.png"} />
            </a>
          </div>
          <div className="col-xs-6 col-sm-5ths col-sm-pull-1">
            <img alt="Frames" src={"/resources/frames.png"} />
          </div>
          <div className="col-xs-6 col-sm-5ths col-sm-pull-1">
            <img alt="Box" src={"/resources/box.png"} />
          </div>
          <div className="col-xs-6 col-sm-5ths">
            <img alt="Sticker" src={"/resources/sticker.png"} />
          </div>
          <div className="col-xs-6 col-sm-5ths">
            <img alt="T-Shirt" src={"/resources/t-shirt.png"} />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

registerComponent("Hero", Hero);

export default Hero;
