/**
 * Created by vivekp on 23-05-2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import addImageThumb from 'common/images/add.png';
import removeImageThumb from 'common/images/delete_cross_icon.png';
import RemoteImage from 'components/RemoteImage';
import loadingIcon from 'common/images/default_image.png';
import _ from 'lodash';
import './quintet.css';

class QuintetImages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentImageLocation: 0,
            quintetImagesDataUri: this.props.images ? this.props.images : []
        };
        this.onHandleFile = this.onHandleFile.bind(this);
        this.onHandlePreviewFile = this.onHandlePreviewFile.bind(this);
        this.onHandleImageClick = this.onHandleImageClick.bind(this);
        this.onHandleRemoveImage = this.onHandleRemoveImage.bind(this);
    }
    onHandleFile(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = upload => {
                const quintetImagesDataUri = _.cloneDeep(this.state.quintetImagesDataUri);

                const imageObject = [{
                    id: quintetImagesDataUri.length + 1,
                    index: quintetImagesDataUri.length + 1,
                    imageUrl: upload.target.result,
                    imageUploadUrl: '',
                    imageSystemUrl: upload.target.result,
                    action: 'Add',
                    file,
                    fieldTester: null
                }];
                const image = imageObject[0];
                quintetImagesDataUri.push(image);
                this.setState({ quintetImagesDataUri });
                this.props.onImageUpdate(imageObject);
            };
            reader.readAsDataURL(file);
        }
    }

    onHandlePreviewFile(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = upload => {
                const quintetImagesDataUri = this.state.quintetImagesDataUri;
                quintetImagesDataUri[this.state.currentImageLocation] = upload.target.result;
                this.props.onImageUpdate(quintetImagesDataUri);
            };
            reader.readAsDataURL(file);
        }
    }

    onHandleImageClick(location) {
        this.setState({
            currentImageLocation: location
        });
    }

    onHandleRemoveImage(location) {
        const quintetImagesDataUri = _.cloneDeep(this.state.quintetImagesDataUri);
        const imageObject = [{
            id: this.state.quintetImagesDataUri[location].id,
            index: this.state.quintetImagesDataUri[location].index,
            imageUrl: '',
            imageUploadUrl: '',
            imageSystemUrl: '',
            action: 'Delete',
            fieldTester: null
        }];
        quintetImagesDataUri.splice(location, 1);
        this.setState({ quintetImagesDataUri });
        this.props.onImageUpdate(imageObject);
    }

    render() {
        const imagesrc = [];
        _.map([0, 1, 2, 3, 4], number => {
            if (this.state.quintetImagesDataUri.length > 0
          && this.state.quintetImagesDataUri[number]) {
                imagesrc.push(this.state.quintetImagesDataUri[number].imageUrl);
            } else if (this.state.quintetImagesDataUri.length === number && this.props.edit) {
                imagesrc.push(addImageThumb);
            } else {
                imagesrc.push('');
            }
        });
        const range = _.range(0, this.state.quintetImagesDataUri.length >= 5 ?
        5 : this.state.quintetImagesDataUri.length + 1);

        return (
          <div>
            <div className="large-preview-img-div">
              <label className="upload-img" htmlFor="fileupload">

                <RemoteImage
                  className="large-preview-img"
                  src={this.state.quintetImagesDataUri.length > 0 ?
                      this.state.quintetImagesDataUri[this.state.currentImageLocation].imageUrl
                      : ''}
                />
              </label>

            </div>
            <div
              className="small-preview-img-div"
            >
              {_.map(range, number => (<label
                key={number}
                className="upload-img" htmlFor="fileupload"
              >

                {(this.state.quintetImagesDataUri.length === number && this.props.edit) ?
                  <div><input
                    type="file"
                    name="fileupload"
                    data-index={number}
                    onChange={this.onHandleFile}
                    accept="image/*"
                  />
                    <RemoteImage
                      defaultIcon={loadingIcon}
                      className="small-preview-img"
                      src={imagesrc[number]}
                      onClick={(this.state.quintetImagesDataUri.length > 0
                        && this.state.quintetImagesDataUri[number]) ?
                            () => this.onHandleImageClick(number)
                            : null}
                      alt=""
                    /></div>
                  : null}
                {(this.state.quintetImagesDataUri.length) > number ?
                  <RemoteImage
                    defaultIcon={loadingIcon}
                    className="small-preview-img"
                    src={imagesrc[number]}
                    onClick={(this.state.quintetImagesDataUri.length > 0
                      && this.state.quintetImagesDataUri[number]) ?
                          () => this.onHandleImageClick(number)
                          : null}
                    alt=""
                  /> : null}
                {(this.state.quintetImagesDataUri.length > 0 &&
              this.state.quintetImagesDataUri[number] && this.props.edit) ?

                <img
                  defaultIcon={loadingIcon}
                  className="remove-img"
                  src={removeImageThumb}
                  onClick={() => this.onHandleRemoveImage(number)}
                  alt=""
                />
                  : null}
              </label>))}
            </div>
          </div>
        );
    }
}

QuintetImages.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object),
    onImageUpdate: PropTypes.func,
    edit: PropTypes.bool
};

export default QuintetImages;
